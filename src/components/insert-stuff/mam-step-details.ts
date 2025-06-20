import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@brightspace-ui/core/components/button/button.js";
import "@brightspace-ui/core/components/typography/typography.js";
import "@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js";

interface ImageData {
  id: string;
  name: string;
  folder: string;
  usageNotes: string;
  size: string;
  createdOn: string;
  keywords: string[];
}

@customElement("mam-step-details")
export class MamStepDetails extends LitElement {
  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
    }
    .container {
      min-height: 400px !important;
    }

    .heading {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 6px;
    }
    .link {
      a {
        font-size: 12px !important;
      }

    }

    .content {
      display: flex;
      gap: 32px;
    }

    .image-box {
      width: 240px;
      height: 240px;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #888;
      font-size: 0.9rem;
    }

    .details {
      flex: 1;
      font-size: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-row {
      display: flex;
    }

    .label {
      width: 140px;
      font-weight: bold;
    }

    .value {
      flex: 1;
    }

    .button-row {
      margin-top: 24px;
      display: flex;
      gap: 12px;
    }
  `;

  @property({ type: Object })
  image: ImageData = {
    id: "img-0",
    name: "Image name",
    folder: "name_folder_anything",
    usageNotes: "Additional information on how assets can be used or not used.",
    size: "800 x 1200 px",
    createdOn: "2025-11-24 16:45:43",
    keywords: ["Keyword1", "Keyword2", "Keyword3"],
  };

  private _next(): void {
    this.dispatchEvent(
      new CustomEvent("next-step", { bubbles: true, composed: true })
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

  render() {
    return html`
      <div class="container">
        <span class="heading">Mayo Clinic MAM (Media Asset Management)</span>
        <a class="link" href="#" @click=${() => this._back()}
          >Search Results ›</a
        >
        <d2l-breadcrumbs>
          <d2l-breadcrumb
          style="font-size:17px"
            text="Search Results "
            class="link"
            @click=${() => this._back()}
            href="#"
          ></d2l-breadcrumb>
        </d2l-breadcrumbs>

        <div class="content">
          <div class="image-box">IMAGE PLACEHOLDER</div>
          <div class="details">
            <div class="detail-row">
              <div class="label">Title</div>
              <div class="value">${this.image?.name}</div>
            </div>
            <div class="detail-row">
              <div class="label">Unique Identifier</div>
              <div class="value">${this.image?.folder}</div>
            </div>
            <div class="detail-row">
              <div class="label">Content Type</div>
              <div class="value">Photograph</div>
            </div>
            <div class="detail-row">
              <div class="label">Collection</div>
              <div class="value">General Library</div>
            </div>
            <div class="detail-row">
              <div class="label">Creation Date</div>
              <div class="value">${this?.image?.createdOn}</div>
            </div>
            <div class="detail-row">
              <div class="label">Image Size</div>
              <div class="value">${this?.image?.size}</div>
            </div>
            <div class="detail-row">
              <div class="label">Usage Notes</div>
              <div class="value">${this?.image?.usageNotes}</div>
            </div>
            <div class="detail-row">
              <div class="label">Keywords</div>
              <div class="value">${this?.image?.keywords?.join(", ")}</div>
            </div>
          </div>
        </div>

        <!--  <div class="button-row">
          <d2l-button primary @click=${this._next}>Next</d2l-button>
          <d2l-button @click=${this._back}>Back</d2l-button>
          <d2l-button @click=${this._cancel}>Cancel</d2l-button>
        </div> -->
      </div>
    `;
  }
}
