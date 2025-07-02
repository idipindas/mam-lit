import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@brightspace-ui/core/components/inputs/input-search.js";
import "@brightspace-ui/core/components/link/link.js";
import "@brightspace-ui/core/components/loading-spinner/loading-spinner.js";
import "@brightspace-ui/core/components/alert/alert.js";
import axios from "axios";

const ORANGE_LOGIC_API = "https://your-org.orangelogic.com/API/search/v4.0/search";
const AUTH_TOKEN = "YOUR_ACCESS_TOKEN_HERE"; 

interface ImageItem {
  id: string;
  name: string;
  thumbnailUrl: string;
}

@customElement("mam-step-search")
export class MamStepSearch extends LitElement {
  static styles = css`
    .search-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
      min-height: 100px;
    }

    .heading {
      font-weight: bold;
      font-size: 16px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 16px;
      margin: 20px 0;
    }

    .thumbnail {
      width: 100%;
      height: 100px;
      background-color: #eee;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid transparent;
      cursor: pointer;
      overflow: hidden;
    }

    .thumbnail:hover {
      border-color: #006fbf;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .load-more-container {
      background-color: #f9fbff;
      border: 1px solid #d9e7f7;
      border-radius: 6px;
      padding: 12px;
      text-align: center;
      margin-bottom: 20px;
      font-size: 0.9rem;
      color: #333;
    }

    d2l-loading-spinner {
      display: block;
      margin: 20px auto;
    }

    d2l-alert {
      margin-top: 20px;
    }
  `;

  @state()
  private searchTerm: string = "";

  @state()
  private results: ImageItem[] = [];

  @state()
  private page: number = 1;

  @state()
  private totalCount: number = 0;

  @state()
  private loading: boolean = false;

  @state()
  private loadingMore: boolean = false;

  @state()
  private searchAttempted: boolean = false;

  private limit: number = 18;

  private _handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  private async _triggerSearch(): Promise<void> {
    if (!this.searchTerm.trim()) return;

    this.loading = true;
    this.searchAttempted = true;
    this.results = [];

    try {
      const response = await axios.get(ORANGE_LOGIC_API, {
        params: {
          query: this.searchTerm,
          format: "json",
          fields: ["SystemIdentifier", "Title", "Path_TR7"],
          pagenumber: 1,
          countperpage: this.limit,
        },
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      const { Items, TotalCount } = response.data;

      this.results = Items.map((item: any) => ({
        id: item.SystemIdentifier,
        name: item.Title,
        thumbnailUrl: item.Path_TR7?.URI || "",
      }));

      this.totalCount = TotalCount;
      this.page = 1;
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      this.loading = false;
    }
  }

  private async _loadMore(): Promise<void> {
    this.loadingMore = true;
    const nextPage = this.page + 1;

    try {
      const response = await axios.get(ORANGE_LOGIC_API, {
        params: {
          query: this.searchTerm,
          format: "json",
          fields: ["SystemIdentifier", "Title", "Path_TR7"],
          pagenumber: nextPage,
          countperpage: this.limit,
        },
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      const { Items } = response.data;

      const newResults = Items.map((item: any) => ({
        id: item.SystemIdentifier,
        name: item.Title,
        thumbnailUrl: item.Path_TR7?.URI || "",
      }));

      this.results = [...this.results, ...newResults];
      this.page = nextPage;
    } catch (error) {
      console.error("Load more failed", error);
    } finally {
      this.loadingMore = false;
    }
  }

  private _selectImage(image: ImageItem): void {
    this.dispatchEvent(
      new CustomEvent("select-image", {
        detail: image,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="search-container">
        <span class="heading">Mayo Clinic MAM (Media Asset Management)</span>
        <span>Search by keyword to find relevant images.</span>

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
            <div>
              <strong>${this.results.length}</strong> of ${this.totalCount} results
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
    `;
  }
}
