import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@brightspace-ui/core/components/button/button.js";
import "@brightspace-ui/core/components/typography/typography.js";
import "@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js";
import { Router } from "@vaadin/router";
import axios from "axios";

// interface ImageData {
//   id: string;
//   name: string;
//   folder: string;
//   usageNotes: string;
//   size: string;
//   createdOn: string;
//   keywords: string[];
// }

@customElement("insert-stuff-details-page")
export class InsertStuffDetailsPage extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      padding: 24px;
      box-sizing: border-box;
      font-family: sans-serif;
      max-width: 960px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 16px;
      font-weight: bold;
      font-size: 20px;
      color: black;
    }
    .subheading {
      font-weight: bold;
      font-size: 16px;
      color: black;
      margin-bottom: 20px;
    }

    d2l-heading {
      color: black;
    }

    d2l-breadcrumbs {
      margin-bottom: 24px;
    }

    .content {
      flex: 1;
      display: flex;
      gap: 32px;
      flex-wrap: wrap;
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
      background: #f9f9f9;
    }

    .details {
      flex: 1;
      min-width: 300px;
      font-size: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-row {
      display: flex;
      flex-wrap: wrap;
    }

    .label {
      width: 160px;
      font-weight: bold;
      color: black;
    }

    .value {
      flex: 1;
      color: black;
    }

    .footer {
      display: flex;
      justify-content: flex-start;
      margin-top: 32px;
      gap: 12px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    const state = history.state;
    if (state?.image) {
      this.image = state.image;
    }
    if (state?.image?.id) {
      this._fetchImageDetails(state.image.id);
    }
    console.log(this.image, "===================");
  }
  private async _fetchImageDetails(id: string) {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/image-details?id=${id}`
      );
      this.image = res.data;
      console.log(res.data, "Image details loaded");
    } catch (error) {
      console.error("Error loading image details:", error);
    }
  }

  @property({ type: Object })
  image: any;

  private _next(): void {
    history.pushState({ image: this.image }, "", "/page-3");
    Router.go("/page-3");
  }

  private _back(): void {
        Router.go("/page-1");

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
      <div class="header">
        <div class="heading">Insert Stuff</div>
        <div class="subheading">Mayo Clinic MAM (Media Asset Management)</div>
      </div>

      <d2l-breadcrumbs>
        <d2l-breadcrumb
          text="Search Results"
          @click=${this._back}
        ></d2l-breadcrumb>
        <d2l-breadcrumb text="Image Details"></d2l-breadcrumb>
      </d2l-breadcrumbs>

      <div class="content">
        <div class="image-box">
          ${this.image?.thumbnailUrl
            ? html`<img
                src="${this.image.thumbnailUrl}"
                alt="${this.image.name}"
                style="max-width: 100%; max-height: 100%; object-fit: contain;"
              />`
            : html`No image available`}
        </div>
        <div class="details">
          <div class="detail-row">
            <div class="label">Title</div>
            <div class="value">${this.image.title}</div>
          </div>
          <div class="detail-row">
            <div class="label">Unique Identifier</div>
            <div class="value">${this.image.id}</div>
          </div>
          <div class="detail-row">
            <div class="label">Content Type</div>
            <div class="value">${this.image.mimeType}</div>
          </div>
          <div class="detail-row">
            <div class="label">Collection</div>
            <div class="value">${this.image.DocSubType}</div>
          </div>
          <div class="detail-row">
            <div class="label">Creation Date</div>
            <div class="value">${this.image.createDate}</div>
          </div>
          <div class="detail-row">
            <div class="label">Image Size</div>
            <div class="value">${this.image.imageSize}</div>
          </div>
          <div class="detail-row">
            <div class="label">Usage Notes</div>
            <div class="value">${this.image.captionLong}</div>
          </div>
          <div class="detail-row">
            <div class="label">Keywords</div>
            <div class="value">${this.image?.keywords?.join(", ")}</div>
          </div>
        </div>
      </div>

      <div class="footer">
        <d2l-button primary @click=${this._next}>Next</d2l-button>
        <d2l-button @click=${this._back}>Back</d2l-button>
        <d2l-button @click=${this._cancel}>Cancel</d2l-button>
      </div>
    `;
  }
}
