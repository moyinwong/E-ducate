import React from "react";
import CarouselReact from "../components/CarouselReact";
import { Container, Row, Col, Image } from "react-bootstrap";
import "./Homepage.scss";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { IRootState } from "../redux/store";
import { useSelector } from "react-redux";
//import DropdownMenu from "../components/DropdownMenu";
import * as dotenv from "dotenv";
dotenv.config();

const HomePage: React.FC = () => {
  const userId = useSelector((state: IRootState) => state.auth.id);
  //console.log()

  return (
    <div>
      <section className="section-banner">
        <Container fluid="lg">
          <Row>
            {/* <div className="section-banner-container"> */}
            <Col>
              <div className="section-banner-text">
                <div style={{ color: "#212121" }}>
                  仲去補習社？ &bull; &bull; &bull;
                </div>
                <div style={{ fontSize: "30px", color: "#777272" }}>
                  用E-DUCATE上堂，我地幫你搞掂！
                </div>
                {userId === null && (
                  <Button href="/signup" variant="light">
                    立刻註冊
                  </Button>
                )}
              </div>
            </Col>
            <Col>
              <img
                style={{ height: "280px", margin: "30px 0px" }}
                src={require("./icons/geography.png")}
                alt="logo"
              />
            </Col>

            {/* </div> */}
          </Row>
        </Container>
      </section>

      <section className="courses-carousel">
        <CarouselReact type="popular" />
      </section>

      <section className="body-section-intro">
        <Container>
          <Row className="justify-content-centers">
            <Col md={12} className="section-title">
              中學生線上學習平台
            </Col>
            <Col md={2}>
              <div></div>
            </Col>
            <Col md={8}>
              Educate是一個為中學生而設的網上學習平台，
              透過網絡令同學接觸到更多不同的學習資源，讓同學足不出戶就能以十倍效率、一半時間、
              針對自己的學習需要極速進步，輕鬆學習！
            </Col>
            <Col md={2}>
              <div></div>
            </Col>
          </Row>

          <Row className="section-cards">
            <Col>
              <div className="section-card">
                <div>
                  <img
                    className="section-icon"
                    src={require("./icons/clock.png")}
                    alt="icon"
                  />
                </div>
                <div>
                  <h6>靈活學習</h6>
                  <div>隨時隨地學習，靈活運用時間</div>
                </div>
              </div>
            </Col>

            <Col>
              <div className="section-card">
                <div>
                  <img
                    className="section-icon"
                    src={require("./icons/goal.png")}
                    alt="icon"
                  />
                </div>
                <div>
                  <h6>多種課程</h6>
                  <div>多種不同課程助你擴闊知識，達到目標</div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="section-cards">
            <Col>
              <div className="section-card">
                <div>
                  <img
                    className="section-icon"
                    src={require("./icons/lectern.png")}
                    alt="icon"
                  />
                </div>
                <div>
                  <h6>專業導師團隊</h6>
                  <div>嚴選導師，教學經驗豐富，教學生動易明</div>
                </div>
              </div>
            </Col>
            <Col>
              <div className="section-card">
                <div>
                  <img
                    className="section-icon"
                    src={require("./icons/pencil-holder.png")}
                    alt="icon"
                  />
                </div>
                <div>
                  <h6>學習效率</h6>
                  <div>隨時重溫課堂錄影及筆記，提高學習效率</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="courses-carousel">
        <CarouselReact type="goodComment" />
      </section>

      <section className="section-photo-banner">
        <Image fluid src={require("./icons/tecky.png")} />
      </section>
    </div>
  );
};

export default HomePage;
