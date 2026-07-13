import { LitElement, html, css } from 'lit';

class CustomerReviews extends LitElement {
  static get properties() {
    return {
      apiUrl: { type: String },
      placeId: { type: String },
      reviews: { type: Array }
    };
  }

  constructor() {
    super();
    this.apiUrl = 'https://solarpool.com.ar/reviews.json';
    this.placeId = '';
    this.reviews = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchReviews();
  }

  async fetchReviews() {
    if (!this.apiUrl) return;

    try {
      const response = await fetch(`${this.apiUrl}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const reviews = await response.json();
      this.reviews = reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      this.reviews = []; // Reset reviews on error
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 80%;
        margin: auto;
        padding: 20px;
      }
      
      .reviews {
        display: flex;
        flex-direction: column;
        list-style-type: none;
        padding: 0;
      }
      
      .review {
        border-bottom: 1px solid #ddd;
        padding: 10px 0;
      }
      
      .review:last-child {
        border-bottom: none;
      }
      
      .review-author {
        font-size: 1.2em;
        font-weight: bold;
      }
      
      .review-text {
        font-style: italic;
        font-size: 1.2em;
        margin-top: 5px;
      }
      .stars {
        color: gold;
        font-size: 1.2em;
      }  

      #more{
        text-align: right;
        font-size: 1.2em;
        margin-top: 10px;
      }
      #more a{
        color: #000;
        text-decoration: none;
      }  
    `;
  }

  render() {
    return html`
      <div class="reviews">
        ${this.reviews.length > 0 ? this.reviews.map(review => html`
          <div class="review">
            <div class="review-author">${review.author_name}</div>
            <div class="stars">${this.renderStars(review.rating)}</div>
            <div class="review-text">${review.text}</div>
          </div>
        `) : html`<p>Loading reviews...</p>`}
        
      </div>
      <div id="more"> <a href="https://g.page/r/CZSN4Jwth6fzEAE/" target="_blank">ver más...</a></div>
    `;
  }

  renderStars(rating) {
        const totalStars = 5;
        let stars = '';
        for (let i = 0; i < totalStars; i++) {
          stars += (i < rating) ? '★' : '☆'; // Filled star for rating, empty star otherwise
        }
        return stars;
  }
}

// Define the custom element
customElements.define('customer-reviews', CustomerReviews);
