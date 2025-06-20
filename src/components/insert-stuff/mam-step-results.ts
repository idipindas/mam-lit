import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@brightspace-ui/core/components/button/button.js";
import "@brightspace-ui/core/components/inputs/input-search.js";
import "@brightspace-ui/core/components/link/link.js";

interface ImageItem {
  id: string;
  name: string;
}

@customElement("mam-step-results")
export class MamStepResults extends LitElement {
  static styles = css`
  .container{
        min-height: 400px !important;
}
    .heading {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 6px;
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
      border-color: #006fbf;
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

    .load-more-container d2l-link {
      margin-right: 8px;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-start;
      gap: 10px;
    }
  `;

  @state()
  private mockResults: ImageItem[] = [];

  @state()
  private visibleCount: number = 12;

  private totalCount: number = 30;

  constructor() {
    super();
    this.mockResults = Array.from({ length: 12 }, (_, i) => ({
      id: `img-${i}`,
      name: `x-ray ${i + 1}`,
    }));
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

  private _back(): void {
    this.dispatchEvent(
      new CustomEvent("back-step", { bubbles: true, composed: true })
    );
  }

  private _cancel(): void {
    this.dispatchEvent(
      new CustomEvent("cancel", { bubbles: true, composed: true })
    );
  }

  private _next(): void {
    this.dispatchEvent(
      new CustomEvent("next-step", { bubbles: true, composed: true })
    );
  }

  private _loadMore(): void {
    const remaining = this.totalCount - this.visibleCount;
    const toAdd = Math.min(18, remaining);
    const startIndex = this.mockResults.length;

    const newItems = Array.from({ length: toAdd }, (_, i) => ({
      id: `img-${startIndex + i}`,
      name: `x-ray ${startIndex + i + 1}`,
    }));

    this.mockResults = [...this.mockResults, ...newItems];
    this.visibleCount += toAdd;
  }

  render() {
    return html`
      <div class="container">
        <span class="heading">Mayo Clinic MAM (Media Asset Management)</span>
        <span>Search by keyword to find relevant images.</span>

        <d2l-input-search
          label="Search by keyword to find relevant images"
          placeholder="e.g. x-ray"
        ></d2l-input-search>

        <div><strong>${this.visibleCount}</strong> Search Results</div>

        <div class="grid">
          ${this.mockResults
            .slice(0, this.visibleCount)
            .map(
              (item) => html`
                <div class="thumbnail" @click=${() => this._selectImage(item)}>
                  ${item.name}
                </div>
              `
            )}
        </div>

        <div class="load-more-container">
          ${this.visibleCount < this.totalCount
            ? html`
                <d2l-link href="#" @click=${this._loadMore}
                  >Load 18 More</d2l-link
                >
              `
            : null}
          | ${this.visibleCount} of ${this.totalCount} Images
        </div>
<!--
        <div class="action-buttons">
          <d2l-button primary @click=${this._next}>Next</d2l-button>
          <d2l-button @click=${this._back}>Back</d2l-button>
          <d2l-button @click=${this._cancel}>Cancel</d2l-button>
        </div> -->
      </div>
    `;
  }
}
