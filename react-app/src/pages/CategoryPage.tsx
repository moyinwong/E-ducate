import React, { useEffect, useState } from "react";
import {
  Accordion,
  Alert,
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  DropdownButton,
  Form,
  Container,
} from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import FlattedCard from "../components/FlattedCard";
import Rating from "react-rating";
import { useDispatch } from "react-redux";
//import { push } from "connected-react-router";
import { push } from "connected-react-router";
import "./CategoryPage.scss";

export interface ICourse {
  course_name: string;
  course_description: string;
  objective: string;
  prerequisites: string;
  price: string;
  id: number;
  category_id: number;
  subcategory_id: number;
  purchased_users_num: string;
  rated_num: string;
  rated_score: string | null;
  tutor_name: string;
  image: string;
  lessons_number: number;
  trash?: boolean;
  tutor_image?: string;
  tutor_email?: string;
}

const CategoryPage: React.FC = () => {
  const [initCourses, setInitCourses] = useState<Array<ICourse>>([]);
  const [courses, setCourses] = useState<Array<ICourse>>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [orderMethod, setOrderMethod] = useState("最受歡迎");
  const [ratingSelection, setRatingSelection] = useState("0");
  const [priceSelection, setPriceSelection] = useState("0");
  const param: { categoryName: string } = useParams();
  const [isShowAlert, setIsShowAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [isSubCategory, setIsSubCategory] = useState<boolean>(false);
  const [displayCourseNum, setDisplayCourseNum] = useState(10);
  const [totalCourseNum, setTotalCourseNum] = useState(0);
  const [Yposition, setYPosition] = useState<{ Y: number }>({
    Y: window.pageYOffset,
  });

  //const [totalYHeight, setTotalYHeight] = useState(0);
  const { categoryName } = param;

  function handleScroll(event: any) {
    //setTotalYHeight((prevHeight) => document.body.clientHeight);
    setYPosition({
      Y: event.target.scrollingElement.scrollTop + window.innerHeight,
    });
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (
      Yposition.Y >= document.body.clientHeight &&
      displayCourseNum < totalCourseNum
    ) {
      //console.log("hahahha");
      setDisplayCourseNum((prevNum) => prevNum + 10);
    }
  }, [Yposition, totalCourseNum, displayCourseNum]);

  useEffect(() => {
    if (
      categoryName === "編程" ||
      categoryName === "廚藝" ||
      categoryName === "DIY" ||
      categoryName === "美容"
    ) {
      setIsSubCategory(true);
    } else {
      setIsSubCategory(false);
    }
  }, [categoryName]);

  const dispatch = useDispatch();

  //to check current route
  let location = useLocation();

  //run once when init
  useEffect(() => {
    getAllCoursesByCategory();
    document.title = ` ${categoryName}課程`;
    document.getElementById("website-header")!.style.display = "block";
    return () => {
      document.title = "e-ducate";
    };
  }, [categoryName]);

  const getAllCoursesByCategory = async () => {
    try {
      let queryRoute: string = "/category/";

      //if is "others" category, change the api route
      if (location.pathname.match(/others\/./)) {
        //console.log("ahah");
        queryRoute += "others/";
      }

      const fetchRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${queryRoute}${categoryName}`
      );

      //if no such category
      if (fetchRes.status === 500) {
        throw new Error("伺服器發生問題");
        //dispatch(push("/404"));
        //return;
      }

      const result = await fetchRes.json();
      const { courses } = result;
      const orderedCourses = courses.slice();
      orderedCourses.sort(
        (a: ICourse, b: ICourse) =>
          parseInt(b.purchased_users_num) - parseInt(a.purchased_users_num)
      );

      ////console.log(orderedCourses);

      setCourses(orderedCourses);
      setTotalCourseNum(orderedCourses.length);
      ////console.log(totalCourseNum);
      //for reset
      setInitCourses(orderedCourses);
    } catch (err) {
      setAlertMsg(err.message);
      setIsShowAlert(true);
    }
  };

  //handle order button click
  function handleOrderButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (orderMethod === "event.currentTarget.innerHTML") {
      return;
    }
    const newMethod = event.currentTarget.innerHTML;
    setOrderMethod(newMethod);
    const newOrderedCourses = courses.slice();
    if (newMethod === "最受歡迎") {
      newOrderedCourses.sort(
        (a, b) =>
          parseInt(b.purchased_users_num) - parseInt(a.purchased_users_num)
      );
    } else if (newMethod === "最低價錢") {
      newOrderedCourses.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    } else if (newMethod === "最受好評") {
      newOrderedCourses.sort(
        (a, b) =>
          (b.rated_score ? parseFloat(b.rated_score) : 0) -
          (a.rated_score ? parseFloat(a.rated_score) : 0)
      );
    }
    setCourses(newOrderedCourses);
  }

  //handle rating selection, set to element's id to selection, otherwise reset
  function handleRatingFormClick(event: React.MouseEvent<HTMLInputElement>) {
    if (ratingSelection === event.currentTarget.id) {
      setRatingSelection("0");
      return;
    }
    setRatingSelection(event.currentTarget.id);
  }

  //if rating selection change, courses list will reset / change filter
  useEffect(() => {
    const newOrderedCourses = initCourses
      .filter((e) => {
        return (
          parseFloat(e.rated_score ? e.rated_score : "0") >=
          parseFloat(ratingSelection)
        );
      })
      .filter((e) => {
        return (
          parseFloat(e.price) < parseFloat(priceSelection) ||
          priceSelection === "0"
        );
      });
    setCourses(newOrderedCourses);
  }, [ratingSelection, priceSelection, initCourses]);

  //handle rating selection, set to element's id to selection, otherwise reset
  function handlePriceFormClick(event: React.MouseEvent<HTMLInputElement>) {
    if (priceSelection === event.currentTarget.id.slice(5, 8)) {
      setPriceSelection("0");
      return;
    }
    setPriceSelection(event.currentTarget.id.slice(5, 8));
  }

  //control panel
  const panelStyle = {
    width: isFilterOpen ? 205 : 0,
    opacity: isFilterOpen ? 1 : 0,
    //overflow: "hidden",
    transition: "all 0.3s ease-out",
  };

  const cardStyle = {
    border: isFilterOpen ? "1px solid rgba(0,0,0,.125)" : "none",
    width: isFilterOpen ? 205 : 0,
    opacity: isFilterOpen ? 1 : 0,
    transition: "all 0.3s ease-out",
  };

  return (
    <>
      {isShowAlert && (
        <Alert key="info" variant="warning" className="warning-alert">
          {alertMsg}
        </Alert>
      )}
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => dispatch(push("/"))}>
          主頁
        </Breadcrumb.Item>
        {isSubCategory && (
          <Breadcrumb.Item onClick={() => dispatch(push("/category/其他/"))}>
            其他
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item active>{categoryName}課程</Breadcrumb.Item>
      </Breadcrumb>

      <Container>
        <div className={"category-main-container"}>
          <div>
            <h1>所有{categoryName}課程</h1>
          </div>
          <div className="button-container">
            <Button
              variant="outline-secondary"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              篩選
            </Button>

            <DropdownButton
              variant="outline-secondary"
              id="dropdown-basic-button"
              title={orderMethod}
            >
              <Dropdown.Item onClick={handleOrderButtonClick}>
                最受歡迎
              </Dropdown.Item>
              <Dropdown.Item onClick={handleOrderButtonClick}>
                最低價錢
              </Dropdown.Item>
              <Dropdown.Item onClick={handleOrderButtonClick}>
                最受好評
              </Dropdown.Item>
            </DropdownButton>
          </div>

          <div className={"panel-card-container"}>
            <div className={"panel"} style={panelStyle}>
              <Accordion defaultActiveKey="0">
                <Card style={cardStyle}>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    評分
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <div>
                        <Form>
                          {["4.5", "4.0", "3.5"].map((e) => {
                            return (
                              <Form.Check
                                className="rating-form"
                                type="radio"
                                id={e}
                                key={e}
                                label={
                                  <>
                                    {e}
                                    <Rating
                                      stop={5}
                                      emptySymbol={[
                                        "far fa-star fa-2x",
                                        "far fa-star fa-2x",
                                        "far fa-star fa-2x",
                                        "far fa-star fa-2x",
                                        "far fa-star fa-2x",
                                      ]}
                                      fullSymbol={[
                                        "fas fa-star fa-2x",
                                        "fas fa-star fa-2x",
                                        "fas fa-star fa-2x",
                                        "fas fa-star fa-2x",
                                        "fas fa-star fa-2x",
                                      ]}
                                      readonly={true}
                                      initialRating={parseFloat(e)}
                                    />
                                    以上
                                  </>
                                }
                                onClick={handleRatingFormClick}
                                checked={ratingSelection === e}
                                readOnly={true}
                              />
                            );
                          })}
                        </Form>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              <Accordion defaultActiveKey="0">
                <Card style={cardStyle}>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    價錢
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <div>
                        <Form>
                          {["少於HK$100", "少於HK$200", "少於HK$300"].map(
                            (e) => {
                              return (
                                <Form.Check
                                  className="rating-form"
                                  type="radio"
                                  id={e}
                                  key={e}
                                  label={e}
                                  onClick={handlePriceFormClick}
                                  checked={"少於HK$" + priceSelection === e}
                                  readOnly={true}
                                />
                              );
                            }
                          )}
                        </Form>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>

            <div className="all-course-container">
              {courses.slice(0, displayCourseNum).map((course, i) => (
                <FlattedCard key={i} {...course}></FlattedCard>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default CategoryPage;
