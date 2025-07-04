import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@brightspace-ui/core/components/inputs/input-search.js";
import "@brightspace-ui/core/components/link/link.js";
import "@brightspace-ui/core/components/loading-spinner/loading-spinner.js";
import "@brightspace-ui/core/components/alert/alert.js";
import "@brightspace-ui/core/components/button/button.js";
import { Router } from "@vaadin/router";
import axios from "axios";


interface ImageItem {
  id: string;
  name: string;
  thumbnailUrl: string;
}

@customElement("insert-stuff-search-page")
export class InsertStuffSearchPage extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      box-sizing: border-box;
      font-family: "Segoe UI", sans-serif;
      padding: 24px;
      max-width: 960px;
      margin: 0 auto;
      color: #333;
    }

    .header {
      margin-bottom: 16px;
    }

    .heading {
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 4px;
    }

    .subheading {
      font-size: 16px;
      color: #555;
      margin-bottom: 8px;
    }

    .search-section {
      margin: 12px 0 20px;
    }

    .count-info {
      font-size: 14px;
      color: #555;
      margin-bottom: 8px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 16px;
      margin-top: 16px;
      margin-bottom: 10px;
    }

    .thumbnail {
      width: 100%;
      height: 100px;
      background-color: #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.9rem;
      color: #666;
      border: 2px solid transparent;
      cursor: pointer;
    }

    .thumbnail:hover {
      border-color: #007cbb;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    d2l-loading-spinner {
      display: block;
      margin: 24px auto;
    }

    .load-more-container {
      text-align: center;
      margin: 16px 0;
      font-size: 0.9rem;
      color: #333;
      background-color: #f9fbff;
      border: 1px solid #d9e7f7;
      border-radius: 6px;
      padding: 12px;
    }

    d2l-alert {
      margin-top: 20px;
    }

    .footer {
      display: flex;
      justify-content: flex-start;
      gap: 12px;
      margin-top: auto;
      padding-top: 32px;
    }
  `;

  @state() private searchTerm = "";
  @state() private results: ImageItem[] = [];
  @state() private page = 1;
  @state() private totalCount = 0;
  @state() private loading = false;
  @state() private loadingMore = false;
  @state() private searchAttempted = false;

  private limit = 18;

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    console.log(target.value);

    this.searchTerm = target.value;
  }

  private async _triggerSearch() {
    if (!this.searchTerm.trim()) return;
    this.loading = true;
    this.searchAttempted = true;
    this.results = [];

    try {
      // const res = await axios.get(ORANGE_LOGIC_API, {
      //   params: {
      //     query: this.searchTerm,
      //     format: "json",
      //     fields: ["SystemIdentifier", "Title", "Path_TR7"],
      //     pagenumber: 1,
      //     countperpage: this.limit,
      //   },
      //   headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      //   withCredentials: true,
      // });

      // const { Items, TotalCount } = res.data;
      // this.results = Items.map((item: any) => ({
      //   id: item.SystemIdentifier,
      //   name: item.Title,
      //   thumbnailUrl: item.Path_TR7?.URI || "",
      // }));
      // this.totalCount = TotalCount;
      const res = await axios.get("http://localhost:3000/api/search", {
        params: {
          q: this.searchTerm,
          page: 1,
          limit: this.limit,
        },
      });
      this.results = res.data.results;
      this.totalCount = res.data.total;
      this.page = 1;
    } catch (err) {
      console.error("Search error", err);
    } finally {
      this.loading = false;
    }
  }
private async _loadMore() {
  this.loadingMore = true;
  const nextPage = this.page + 1;

  try {
    const res = await axios.get("http://localhost:3000/api/search", {
      params: {
        q: this.searchTerm,
        page: nextPage,
        limit: this.limit,
      },
    });

    const newResults = res.data.results;
    this.results = [...this.results, ...newResults];
    this.page = nextPage;
  } catch (err) {
    console.error("Load more error", err);
  } finally {
    this.loadingMore = false;
  }
}


  private _selectImage(image: ImageItem): void {
    history.pushState({ image }, "", "/page-2");
    Router.go("/page-2");
  }

  private _cancel() {
    Router.go("/page-1");
  }

  render() {
    return html`
      <div class="header">
        <div class="heading">Insert Stuff</div>
        <div class="subheading">Mayo Clinic MAM (Media Asset Management)</div>
      </div>

      <div class="search-section">
        <d2l-input-search
          label="Search"
          placeholder="e.g. x-ray"
          @input=${this._handleInput}
          .value=${this.searchTerm}
          @keydown=${(e: KeyboardEvent) =>
            e.key === "Enter" && this._triggerSearch()}
        ></d2l-input-search>
      </div>

      ${this.loading
        ? html`<d2l-loading-spinner size="80"></d2l-loading-spinner>`
        : this.results.length === 0 && this.searchAttempted
        ? html`
            <d2l-alert type="info" has-close-button>
              No results found for "<strong>${this.searchTerm}</strong>"
            </d2l-alert>
          `
        : html`
            <div class="count-info">
              Showing <strong>${this.results.length}</strong> of
              <strong>${this.totalCount}</strong> results
            </div>

            <div class="grid">
              ${this.results.map(
                (item) => html`
                  <div
                    class="thumbnail"
                    @click=${() => this._selectImage(item)}
                  >
                    ${item.thumbnailUrl
                      ? html`<img
                          src="${item.thumbnailUrl}"
                          alt="${item.name}"
                        />`
                      : html`<span>${item.name}</span>`}
                  </div>
                `
              )}
            </div>

            ${this.results.length < this.totalCount
              ? html`
                  <div class="load-more-container">
                    ${this.loadingMore
                      ? html`<d2l-loading-spinner small></d2l-loading-spinner>`
                      : html`<d2l-link href="#" @click=${this._loadMore}
                          >Load More</d2l-link
                        >`}
                    | ${this.results.length} of ${this.totalCount}
                  </div>
                `
              : null}
          `}

      <div class="footer">
        <d2l-button primary @click=${() => Router.go("/page-2")}
          >Next</d2l-button
        >
        <d2l-button @click=${() => console.log("Back clicked")}
          >Back</d2l-button
        >
        <d2l-button @click=${this._cancel}>Cancel</d2l-button>
      </div>
    `;
  }
}
