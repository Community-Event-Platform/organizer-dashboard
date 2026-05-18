import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-col about">
          <h4>Về trang web</h4>
          <p>Một nền tảng quản lý sự kiện và kết nối cho cộng đồng. Trải nghiệm cảm giác phấn khích của các sự kiện thú vị và kết nối với những người có cùng chí hướng gần bạn. Khám phá trang giới thiệu của chúng tôi để tìm hiểu thêm.</p>
          <div className="social-icons">
            <a href="#" className="social-icon fb"><i className="bi bi-facebook"></i></a>
            <a href="#" className="social-icon tw"><i className="bi bi-twitter-x"></i></a>
            <a href="#" className="social-icon ig"><i className="bi bi-instagram"></i></a>
            <a href="#" className="social-icon yt"><i className="bi bi-youtube"></i></a>
          </div>
        </div>

        <div className="footer-col links">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li><a href="#">Trang chủ</a></li>
            <li><a href="#">Quản lý sự kiện</a></li>
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Quản lý người tham gia</a></li>
          </ul>
        </div>

        <div className="footer-col service">
          <h4>Dịch vụ</h4>
          <ul>
            <li><a href="#">Xem sự kiện của tôi</a></li>
            <li><a href="#">Xem người đăng ký</a></li>
            <li><a href="#">Cập nhật sự kiện</a></li>
          </ul>
        </div>

        <div className="footer-col contact">
          <h4>Liên hệ</h4>
          <ul>
            <li>
              <i className="bi bi-geo-alt-fill contact-icon"></i>
              No.123, ABC Street, Son Tra District, DaNang City
            </li>
            <li>
              <i className="bi bi-telephone-fill contact-icon"></i>
              (+84) 373 532 152
            </li>
            <li>
              <i className="bi bi-envelope-fill contact-icon"></i>
              Eventorganizer123@projectadvanced.PNV.com
            </li>
            <li>
              <i className="bi bi-clock-fill contact-icon"></i>
              <span>Thứ Hai - Thứ Bảy: <strong>8:00 - 17:00</strong></span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="copyright">© 2026 EventHub. Bảo lưu mọi quyền.</p>
        <p className="developed-by">Nền tảng sự kiện cộng đồng được phát triển bởi Nhóm 5 của dự án Web nâng cao.</p>
      </div>
    </footer>
  );
};

export default Footer;
