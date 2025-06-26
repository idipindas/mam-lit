import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@brightspace-ui/core/components/inputs/input-textarea.js";
import "@brightspace-ui/core/components/inputs/input-checkbox.js";
import "@brightspace-ui/core/components/button/button.js";
import "@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js";
import { Router } from "@vaadin/router";

interface ImageData {
  id: string;
  name: string;
}

@customElement("insert-stuff-insert-page")
export class InsertStuffInsertPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 24px;
      max-width: 960px;
      margin: auto;
      font-family: sans-serif;
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
      margin: 12px 0 20px;
    }

    .main {
      display: flex;
      flex-wrap: wrap;
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
      min-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      color:black
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

  @state() private image: ImageData = { id: "", name: "" };
  @state() private altText: string = "";
  @state() private isDecorative: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    const state = history.state;
    if (state && state.image) {
      this.image = state.image;
    } else {
      Router.go("/page-1"); // fallback if no image
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

  private _insert() {
    const payload = {
      image: this.image,
      altText: this.isDecorative ? null : this.altText,
      decorative: this.isDecorative,
    };

    console.log("Insert payload:", payload);

    // Dispatch or process the insert logic
    this.dispatchEvent(
      new CustomEvent("insert-image", {
        detail: payload,
        bubbles: true,
        composed: true,
      })
    );

    // Navigate or confirm
    alert("Image inserted successfully!");
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
      <div class="heading">Insert Stuff</div>
      <div class="subheading">Mayo Clinic MAM (Media Asset Management)</div>

      <d2l-breadcrumbs>
        <d2l-breadcrumb text="Search" @click=${this._cancel}></d2l-breadcrumb>
        <d2l-breadcrumb text="Details" @click=${this._back}></d2l-breadcrumb>
        <d2l-breadcrumb text="Insert"></d2l-breadcrumb>
      </d2l-breadcrumbs>

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

      <div class="button-row">
        <d2l-button primary @click=${this._insert}>Insert</d2l-button>
        <d2l-button @click=${this._back}>Back</d2l-button>
        <d2l-button @click=${this._cancel}>Cancel</d2l-button>
      </div>
    `;
  }
}
