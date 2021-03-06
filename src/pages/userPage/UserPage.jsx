import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../authContext/AuthContext";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import {
  editUser,
  changePassword,
  editUserAvatar,
} from "../../authContext/apiCalls";
import { useHistory } from "react-router-dom";
import { Form, Formik } from "formik";
import { TextField } from "../../components/textfield/TextField";
import * as Yup from "yup";
import {
  AccountCircle,
  Bookmark,
  CameraAlt,
  Edit,
  LockSharp,
} from "@material-ui/icons";
import ListitemWatchList from "../../components/listitem/ListitemWatctList";
import storage from "../../firebase";

import Avatar from "@mui/material/Avatar";
import Skeleton from "../../components/skeleton/Skeleton";
import axios from "axios";

export default function UserPage() {
  const history = useHistory();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const createdAt = new Date(currentUser.createdAt).toLocaleDateString();
  const { dispatch } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [toggleState, setToggleState] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const [movie, setMovie] = useState(null);
  const [flag, setFlag] = useState(1000);
  const [users, setUsers] = useState({});
  const [isShow, setIsShow] = useState(false);

  let checked = avatar === null || avatar === undefined ? true : false;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("/users/find/" + currentUser._id, {
          headers: {
            token:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzU4YjZjOTUwMDJlYTJmZjFjYjMzZiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY1Mzk2NDM0NiwiZXhwIjoxOTEzMTY0MzQ2fQ.sGCG3ise2mHJKyGzmSKOmv-LMAv1hRw9fkqYU9avIJg",
          },
        });
        setUsers(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUser();
  }, [flag, currentUser._id]);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const validatePass = Yup.object().shape({
    password: Yup.string()
      .max(255)
      .required("Kh??ng ???????c b??? tr???ng !")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "M???t kh???u t???i thi???u 8 k?? t??? bao g???m ch??? v?? s??? !"
      ),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "M???t kh???u ch??a kh???p vui l??ng nh???p l???i !"
      )
      .required("Kh??ng ???????c b??? tr???ng !"),
  });

  const validate = Yup.object().shape({
    username: Yup.string().required("Kh??ng ???????c b??? tr???ng !").max(30),
    fullName: Yup.string().required("Kh??ng ???????c b??? tr???ng !").max(30),
    email: Yup.string()
      .required("Kh??ng ???????c b??? tr???ng !")
      .matches(
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Email b???n nh???p ch??a ????ng vui l??ng ??i???n l???i !"
      ),
    nation: Yup.string().required("Kh??ng ???????c b??? tr???ng !"),
    phone: Yup.string(),
    date: Yup.string(),
    desc: Yup.string(),
  });

  const upload = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is" + progress + " %done.");
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            setMovie((prev) => {
              return { ...prev, [item.label]: url };
            });
            setUploaded((pre) => pre + 1);
          });
        }
      );
    });
  };

  const handleUpload = (e) => {
    if (uploaded === 0) {
      setLoading(true);
      e.preventDefault();
      upload([{ file: avatar, label: "avatar" }]);
    } else setLoading(false);
  };

  const handleSubmitImg = (e) => {
    e.preventDefault();
    editUserAvatar(movie, dispatch);
    history.push("/");
  };

  const handleSubmit = (values) => {
    console.log(values);
    editUser(values, dispatch);
    history.push("/");
  };

  const handleSubmitPassword = (values) => {
    changePassword(values, dispatch);
    history.push("/");
  };

  const showEditAvatar = () => {
    setIsShowEdit(!isShowEdit);
  };

  return (
    <div className="userpagearia">
      <div className="navbarUSer">
        <Navbar setIsShow={setIsShow} />
      </div>
      <div className="userPage container">
        <div className="user-page">
          <div className="leftSide">
            <div className="infoUserAria">
              <div className="userAria">
                <div className="container magicTab">
                  <div className="bloc-tabs">
                    <button
                      className={
                        toggleState === 1 ? "tabs active-tabs" : "tabs"
                      }
                      onClick={() => toggleTab(1)}
                      title="Th??ng tin c?? nh??n"
                    >
                      <AccountCircle className="accountProfile" />
                    </button>
                    <button
                      className={
                        toggleState === 2 ? "tabs active-tabs" : "tabs"
                      }
                      onClick={() => toggleTab(2)}
                      title="Ch???nh s???a th??ng tin c?? nh??n"
                    >
                      <Edit className="editProfile" />
                    </button>
                    <button
                      className={
                        toggleState === 3 ? "tabs active-tabs" : "tabs"
                      }
                      onClick={() => toggleTab(3)}
                      title="Danh s??ch phim ???? l??u"
                    >
                      <Bookmark className="bookmarkMovie" />
                    </button>
                    <button
                      className={
                        toggleState === 4 ? "tabs active-tabs" : "tabs"
                      }
                      onClick={() => toggleTab(4)}
                      title="?????i m???t kh???u"
                    >
                      <LockSharp className="changePassMovie" />
                    </button>
                    <button className="closeTab" onClick={() => toggleTab(1)}>
                      x
                    </button>
                  </div>

                  <div className="content-tabs">
                    <div
                      className={
                        toggleState === 1 ? "content active-content" : "content"
                      }
                    >
                      <div className="avatarAria">
                        <Avatar
                          className="userAvatar"
                          src={
                            currentUser.profilePic !== ""
                              ? currentUser.profilePic
                              : "https://picsum.photos/200/200"
                          }
                        />
                        <div className="changeAvatarAria">
                          <CameraAlt
                            className="iconChangeAvatar"
                            onClick={showEditAvatar}
                          />
                        </div>
                      </div>
                      {isShowEdit ? (
                        <>
                          <div className="modalBackgroundShow">
                            <div className="modalShowContainer">
                              <button
                                className="btnCloseEditForm"
                                onClick={() => {
                                  setIsShowEdit(false);
                                }}
                              >
                                X
                              </button>
                              <label>C???p nh???t ???nh ?????i di???n</label>
                              <input
                                className="updateImg"
                                name="avatar"
                                type="file"
                                onChange={(e) => setAvatar(e.target.files[0])}
                              />

                              {uploaded === 1 ? (
                                <button
                                  className="addProductButton"
                                  onClick={handleSubmitImg}
                                >
                                  C???p nh???t
                                </button>
                              ) : isLoading ? (
                                <Skeleton type="circle" />
                              ) : checked ? (
                                ""
                              ) : (
                                <button
                                  className="addProductButton"
                                  onClick={handleUpload}
                                  disabled={checked}
                                >
                                  T???i ???nh
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      <br />
                      <span className="userPageName">
                        {currentUser.username}
                      </span>
                      <br />
                      <small>T??n ?????y ?????: {currentUser.fullName}</small>
                      <br />
                      <small>Ng??y sinh: {currentUser.date}</small>
                      <br />
                      <small>?????a ch??? email: {currentUser.email}</small>
                      <br />
                      <small>S??? ??i???n tho???i: {currentUser.phone}</small>
                      <br />
                      <small>Qu???c t???ch: {currentUser.nation}</small>
                      <br />
                      <small>?????a ch???: {currentUser.address}</small>
                      <br />
                      <small>Ng??y l???p t??i kho???n: {createdAt}</small>
                      <p className="userDesc">M?? t???: {currentUser.desc}</p>
                    </div>

                    <div
                      className={
                        toggleState === 2
                          ? "content  active-content"
                          : "content"
                      }
                    >
                      <Formik
                        initialValues={{
                          username: currentUser.username,
                          fullName: currentUser.fullName || "",
                          email: currentUser.email,
                          nation: currentUser.nation || "",
                          phone: currentUser.phone || "",
                          date: currentUser.date || "",
                          desc: currentUser.desc || "",
                          address: currentUser.address || "",
                        }}
                        validationSchema={validate}
                        onSubmit={handleSubmit}
                      >
                        {(formikProps) => (
                          <div>
                            <h2
                              className="editInfoUserTitle"
                              style={{
                                color: "orange",
                                letterSpacing: "1px",
                                marginLeft: "100px",
                              }}
                            >
                              Ch???nh s???a th??ng tin c?? nh??n
                            </h2>
                            <Form className="formRegister">
                              <TextField
                                label="Email"
                                name="email"
                                type="email"
                                disabled
                                onChange={formikProps.handleChange}
                                style={{ width: "80%" }}
                              />
                              <TextField
                                label="T??n hi???n th???"
                                name="username"
                                type="text"
                                onChange={formikProps.handleChange}
                                style={{ width: "80%" }}
                              />
                              <TextField
                                label="T??n ?????y ?????"
                                name="fullName"
                                type="text"
                                onChange={formikProps.handleChange}
                                style={{ width: "80%" }}
                              />
                              <TextField
                                label="Qu???c t???ch"
                                name="nation"
                                type="text"
                                onChange={formikProps.handleChange}
                                style={{ width: "80%" }}
                              />

                              <TextField
                                label="S??? ??i???n tho???i"
                                name="phone"
                                type="phone"
                                onChange={formikProps.handleChange}
                                style={{ width: "80%" }}
                              />

                              <TextField
                                label="Ng??y sinh"
                                name="date"
                                type="date"
                                onChange={formikProps.handleChange}
                                style={{ width: "80%" }}
                              />

                              <TextField
                                label="M?? t??? b???n th??n"
                                name="desc"
                                type="text"
                                onChange={formikProps.handleChange}
                                style={{ width: "80%" }}
                              />

                              <TextField
                                label="?????a ch???"
                                name="address"
                                type="text"
                                onChange={formikProps.handleChange}
                                style={{ width: "80%" }}
                              />

                              <button type="submit" className="updateButton">
                                C???p nh???t
                              </button>
                            </Form>
                          </div>
                        )}
                      </Formik>
                    </div>

                    <div
                      className={
                        toggleState === 3
                          ? "content  active-content"
                          : "content"
                      }
                    >
                      <div className="watchListAria">
                        {users.watchList !== undefined ? (
                          <>
                            <h1>Danh s??ch phim c???a t??i</h1>
                            <div className="myWatchListAria">
                              {users.watchList.map((item, index) => {
                                return (
                                  <div className="" key={index}>
                                    <ListitemWatchList
                                      item={item}
                                      type="watchList"
                                      setFlag={setFlag}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <h2 className="no-movies mb-5">
                            Kh??ng c?? phim trong danh s??ch
                          </h2>
                        )}
                      </div>
                    </div>

                    <div
                      className={
                        toggleState === 4
                          ? "content  active-content"
                          : "content"
                      }
                    >
                      <Formik
                        initialValues={{
                          password: "",
                          confirmPassword: "",
                        }}
                        validationSchema={validatePass}
                        onSubmit={handleSubmitPassword}
                      >
                        {(formikProps) => (
                          <div>
                            <h2
                              className="editInfoUserPassword"
                              style={{
                                color: "orange",
                                letterSpacing: "1px",
                                marginLeft: "210px",
                              }}
                            >
                              ?????i m???t kh???u
                            </h2>
                            <Form>
                              <TextField
                                label="M???t kh???u m???i"
                                name="password"
                                type="password"
                                onChange={formikProps.handleChange}
                                style={{ width: "80%" }}
                              />
                              <TextField
                                label="X??c nh???n m???t kh???u m???i"
                                name="confirmPassword"
                                type="password"
                                onChange={formikProps.handleChange}
                                style={{ width: "80%" }}
                              />

                              <button type="submit" className="updateButton">
                                C???p nh???t
                              </button>
                            </Form>
                          </div>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sideBarAria">
                <Sidebar />
              </div>
            </div>

            {/* CH???P V?? */}

            <div className="footerAria">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
