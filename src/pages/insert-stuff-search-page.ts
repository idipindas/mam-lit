import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@brightspace-ui/core/components/inputs/input-search.js";
import "@brightspace-ui/core/components/link/link.js";
import "@brightspace-ui/core/components/loading-spinner/loading-spinner.js";
import "@brightspace-ui/core/components/alert/alert.js";
import "@brightspace-ui/core/components/button/button.js";
import axios from "axios";
import { Router } from "@vaadin/router";

interface ImageItem {
  id: string;
  name: string;
}

@customElement("insert-stuff-search-page")
export class InsertStuffSearchPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: "Segoe UI", sans-serif;
      color: #333;
    }

    .container {
      max-width: 100%;
    //   margin: 24px auto;
      padding: 10px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      min-height: 96vh;
    }

    .header {
      margin-bottom: 24px;
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
      margin-bottom: 20px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 16px;
      margin: 16px 0;
    }

    .thumbnail {
      height: 100px;
      background-color: #e8f0fe;
      border: 2px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      font-size: 0.9rem;
      font-weight: 500;
      border-radius: 6px;
      cursor: pointer;
      transition: border 0.2s;
    }

    .thumbnail:hover {
      border-color: #007cbb;
    }

    .count-info {
      font-size: 14px;
      color: #555;
      margin-bottom: 8px;
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
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid #ddd;
      margin-top: auto;
    }

    d2l-alert {
      margin-top: 20px;
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
    this.searchTerm = target.value;
  }

  private async _triggerSearch() {
    if (!this.searchTerm.trim()) return;
    this.loading = true;
    this.searchAttempted = true;
    this.results = [];

    try {
      const res = await axios.get("http://localhost:3000/api/v1/search", {
        params: { q: this.searchTerm, page: 1, limit: this.limit },
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
      const res = await axios.get("http://localhost:3000/api/v1/search", {
        params: { q: this.searchTerm, page: nextPage, limit: this.limit },
      });

      this.results = [...this.results, ...res.data.results];
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

  render() {
    return html`
      <div class="container">
        <div class="header">
          <div class="heading">Insert Stuff</div>
          <div class="subheading">
            Mayo Clinic MAM (Media Asset Management)
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
                      ${item.name}
                    </div>
                  `
                )}
              </div>

              ${this.results.length < this.totalCount
                ? html`
                    <div class="load-more-container">
                      ${this.loadingMore
                        ? html`<d2l-loading-spinner small></d2l-loading-spinner>`
                        : html`
                            <d2l-link href="#" @click=${this._loadMore}>
                              Load More
                            </d2l-link>
                          `}
                      | ${this.results.length} of ${this.totalCount}
                    </div>
                  `
                : null}
            `}

        <div class="footer">
          <d2l-button primary @click=${() => console.log("Next clicked")}
            >Next</d2l-button
          >
          <d2l-button @click=${() => console.log("Back clicked")}
            >Back</d2l-button
          >
          <d2l-button @click=${() => console.log("Cancel clicked")}
            >Cancel</d2l-button
          >
        </div>
      </div>
    `;
  }
}
