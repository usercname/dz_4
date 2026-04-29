import './Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h4>About</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Contact</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Returns</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Newsletter</h4>
          <p>Subscribe for exclusive deals</p>
          <form onSubmit={(e) => e.preventDefault()} className="newsletter-form">
            <input type="email" placeholder="Email" disabled />
            <button type="submit" disabled>Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className="footer-copyright">
        © 2026 TechStore. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;