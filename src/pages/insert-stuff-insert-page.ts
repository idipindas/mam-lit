import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@brightspace-ui/core/components/inputs/input-textarea.js";
import "@brightspace-ui/core/components/inputs/input-checkbox.js";
import "@brightspace-ui/core/components/button/button.js";
import "@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js";
import { Router } from "@vaadin/router";
import axios from "axios";

interface ImageData {
  id: string;
  name: string;
  recordID: string;
  thumbnailUrl?: string;
}

@customElement("insert-stuff-insert-page")
export class InsertStuffInsertPage extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      padding: 24px;
      max-width: 960px;
      margin: 0 auto;
      box-sizing: border-box;
      font-family: sans-serif;
    }

    .header {
      margin-bottom: 16px;
    }

    .heading {
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 4px;
      color: black;
    }

    .subheading {
      font-weight: bold;
      font-size: 16px;
      color: black;
      margin-bottom: 20px;
    }

    d2l-breadcrumbs {
      margin-bottom: 24px;
    }

    .main {
      flex: 1;
      display: flex;
      gap: 32px;
      flex-wrap: wrap;
    }

    .preview {
      width: 280px;
      height: 280px;
      background-color: #ddd;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
      color: #999;
      border: 1px solid #ccc;
    }

    .form-section {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .checkbox {
      margin-top: 8px;
    }

    .footer {
      display: flex;
      justify-content: flex-start;
      margin-top: 32px;
      gap: 12px;
    }
  `;

  @state() private image: ImageData = { id: "", name: "", recordID: "" };
  @state() private altText: string = "";
  @state() private isDecorative: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    const state = history.state;
    if (state?.image) {
      this.image = state.image;
    } else {
      Router.go("/page-1");
    }
  }

  private _handleAltTextChange(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.altText = target.value;
  }

  private _toggleDecorative(e: Event) {
    const target = e.target as HTMLInputElement;
    this.isDecorative = target.checked;
    if (this.isDecorative) this.altText = "";
  }

  private async _insert() {
    const payload = {
      image: this.image,
      altText: this.isDecorative ? "" : this.altText,
      isDecorative: this.isDecorative
    };
console.log("/////////////", this.image.recordID,payload.altText, payload.isDecorative);

    try {
      const response = await axios.patch("http://localhost:3000/api/image-metadata", {
        recordID: this.image.recordID,
        altText: payload.altText,
        isDecorative: payload.isDecorative
      });

      console.log("Metadata updated:", response.data);

      this.dispatchEvent(
        new CustomEvent("insert-image", {
          detail: payload,
          bubbles: true,
          composed: true
        })
      );

      alert("Image metadata saved and inserted successfully!");
    } catch (error: any) {
      console.error("Insert failed:", error);
      alert("Failed to insert image. Please try again.");
    }
  }

  private _back() {
    history.pushState({ image: this.image }, "", "/page-2");
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

      <d2l-breadcrumbs>
        <d2l-breadcrumb text="Search" @click=${this._cancel}></d2l-breadcrumb>
        <d2l-breadcrumb text="Details" @click=${this._back}></d2l-breadcrumb>
        <d2l-breadcrumb text="Insert"></d2l-breadcrumb>
      </d2l-breadcrumbs>

      <div class="main">
        <div class="preview">
          ${this.image.thumbnailUrl
            ? html`<img src=${this.image.thumbnailUrl} alt="" style="max-width:100%; max-height:100%;" />`
            : html`IMAGE PREVIEW`}
        </div>

        <div class="form-section">
          <d2l-input-textarea
            label="Alternative Text (Describe your image)"
            .value=${this.altText}
            ?disabled=${this.isDecorative}
            @input=${this._handleAltTextChange}
          ></d2l-input-textarea>

          <div class="checkbox">
            <d2l-input-checkbox
              label="This image is decorative"
              .checked=${this.isDecorative}
              @change=${this._toggleDecorative}
            ></d2l-input-checkbox>
          </div>
        </div>
      </div>

      <div class="footer">
        <d2l-button primary @click=${this._insert}>Insert</d2l-button>
        <d2l-button @click=${this._back}>Back</d2l-button>
        <d2l-button @click=${this._cancel}>Cancel</d2l-button>
      </div>
    `;
  }
}
