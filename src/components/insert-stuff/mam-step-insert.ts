import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@brightspace-ui/core/components/inputs/input-textarea.js";
import "@brightspace-ui/core/components/inputs/input-checkbox.js";
import "@brightspace-ui/core/components/button/button.js";

interface ImageData {
  id: string;
  name: string;
}

@customElement("mam-step-insert")
export class MamStepInsert extends LitElement {
  static styles = css`
    .container {
      min-height: 400px !important;
    }

    .heading {
     font-weight: bold;
      font-size: 16px;
      margin-bottom: 4px;
    }

    .link {
      color: #007cbb;
      margin-bottom: 16px;
      display: inline-block;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .main {
      display: flex;
      gap: 24px;
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
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 20px;
    }

    .checkbox {
      margin-top: 8px;
    }

    .button-row {
      margin-top: 30px;
      display: flex;
      gap: 12px;
    }
  `;

  @property({ type: Object })
  image: ImageData = {
    id: "img-0",
    name: "Image Placeholder",
  };

  @state() private altText: string = "";
  @state() private isDecorative: boolean = false;

  render() {
    return html`
      <div class="container">
        <div class="heading">Mayo Clinic MAM (Media Asset Management)</div>
        <div class="link">Search Results ></div>

        <div class="main">
          <div class="preview">IMAGE PLACEHOLDER</div>

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
<!--
        <div class="button-row">
          <d2l-button primary @click=${this._insert}>Insert</d2l-button>
          <d2l-button @click=${this._back}>Back</d2l-button>
          <d2l-button @click=${this._cancel}>Cancel</d2l-button>
        </div> -->
      </div>
    `;
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

  private _insert() {
    const payload = {
      image: this.image,
      altText: this.isDecorative ? null : this.altText,
      decorative: this.isDecorative,
    };

    this.dispatchEvent(
      new CustomEvent("insert-image", {
        detail: payload,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _back() {
    this.dispatchEvent(
      new CustomEvent("back-step", { bubbles: true, composed: true })
    );
  }

  private _cancel() {
    this.dispatchEvent(
      new CustomEvent("cancel", { bubbles: true, composed: true })
    );
  }
}
