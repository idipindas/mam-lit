import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

import "@brightspace-ui/core/components/inputs/input-text.js";
import "@brightspace-ui/core/components/icons/icon.js";
import "@brightspace-ui/core/components/button/button.js";
import "@brightspace-ui/core/components/typography/typography.js";
import "@brightspace-ui/core/components/inputs/input-search.js";

@customElement("mam-step-search")
export class MamStepSearch extends LitElement {
  static styles = css`
    .search-container {
      display: flex;
      align-items: start;
      gap: 10px;
      flex-direction: column;

      margin-bottom: 20px;
      min-height: 400px !important;
    }
    .heading {
      font-weight: bold;
      font-size: 16px;
    }

    .button-row {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }

    d2l-input-text {
      flex: 1;
    }

    .search-icon {
      cursor: pointer;
      margin-top: 24px;
    }
  `;

  @state()
  private searchTerm: string = "";

  private _handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  private _triggerSearch(): void {
    console.log(`Search triggered for: ${this.searchTerm}`);
  }

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
      <div class="search-container">
        <span class="heading">Mayo Clinic MAM (Meadia Asset Management)</span>

        <span>Search for media assets using relevant keywords.</span>
        <d2l-input-search
          label="Search by keyword to find relevant images"
          placeholder="e.g. city"
          @input=${this._handleInput}
          .value=${this.searchTerm}
          @keydown=${(e: KeyboardEvent) =>
            e.key === "Enter" && this._triggerSearch()}
        ></d2l-input-search>
      </div>
<!--
      <div class="button-row">
        <d2l-button primary @click=${this._next}>Next</d2l-button>
        <d2l-button @click=${this._back}>Back</d2l-button>
        <d2l-button @click=${this._cancel}>Cancel</d2l-button>
      </div> -->
    `;
  }
}
