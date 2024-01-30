const Footer = () => {
  return (
    <footer className="footer bg-green-600 text-white py-5 lg:py-5">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
        {/* Services */}
        <div className="footer-nav mb-8 lg:mb-0">
          <h2 className="footer-title mb-4">Services</h2>
          <a className="link mb-2">Branding</a>
          <a className="link mb-2">Design</a>
          <a className="link mb-2">Marketing</a>
          <a className="link mb-2">Advertisement</a>
        </div>

        {/* Company */}
        <div className="footer-nav mb-8 lg:mb-0">
          <h2 className="footer-title mb-4">Company</h2>
          <a className="link mb-2">About us</a>
          <a className="link mb-2">Contact</a>
          <a className="link mb-2">Jobs</a>
          <a className="link mb-2">Press kit</a>
        </div>

        {/* Social */}
        <div className="footer-nav">
          <h2 className="footer-title mb-4">Social</h2>
          <div className="flex space-x-4">
            <a href="#" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                {/* Facebook icon path */}
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                {/* Twitter icon path */}
              </svg>
            </a>
            <a href="#" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                {/* Instagram icon path */}
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;