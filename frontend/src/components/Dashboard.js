import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import Loding from "./Loding";
import * as Realm from "realm-web";
import Header from "./Header";

const Dashboard = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [message, setUpdateMessage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [search, setSearch] = useState("");

  const idRef = useRef();
  useEffect(() => {
    getAllBooks();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    // console.log(user);
    setUserId(user._id);
    // console.log(userId);
  }, []);

  useEffect(() => {
    if (search == null || search == "") getAllBooks();
  }, [search]);

  useEffect(() => {
    const timeoutId = idRef.current;
    // console.log(timeoutId);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [message]);

  // deleting book from database if after issuing it the quantity becomes 0
  const deleteBook = async (id) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      setLoading(true);
      const { data } = await axios
        .post(
          "/api/book/delete",
          {
            id,
          },
          config
        )
        .then((res) => {
          if (res.status === 200) {
            // set("Deletion is done successfully");
            getAllBooks();
          }
        });
      setLoading(false);
    } catch (error) {
      // setError(error.response.data.message);
      setLoading(false);
    }
  };

  // to issue a book
  const issueBook = async (id) => {
    // console.log(id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      setLoading(true);
      const { data } = await axios
        .post(
          "/api/book/issue",
          {
            bookid: id,
            userid: userId,
          },
          config
        )
        .then((res) => {
          if (res.status === 200) {
            setUpdateMessage("Book Issued successfully!");
            const timeout = setTimeout(() => {
              setUpdateMessage(null);
            }, 2000);
            idRef.current = timeout;

            let data = res.data.data;
            let avaialableQuantity = res.data.data.noOfCopies;
            if (avaialableQuantity == 1) {
              deleteBook(data._id);
            }
            if (search == null || search == "") getAllBooks();
          }
        });
      setLoading(false);
    } catch (error) {
      // setError(error.response.data.message);
      setLoading(false);
    }
  };

  // fetch all books from db
  const getAllBooks = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      setLoading(true);
      axios.get("/api/book/get").then((res) => {
        let data = res.data.data;
        setBooks(data);
      });
      setLoading(false);
    } catch (error) {
      // setError(error.response.data.message);
      setLoading(false);
    }
  };

  //  searching a book based on Author's lastname/firstname by using mongodb realm functions
  const searchBook = async (e) => {
    setLoading(true);
    const app = new Realm.App({ id: "application-1-vcdfm" });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      const searchedBooks = await user.functions.searchBooks(search);
      setBooks(() => searchedBooks);
      setLoading(false);
      // console.log(searchedBooks);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="bgDashboard"></div>
      <div className="container position-relative">
        <Header />
        {loading && <Loding />}
        {message && <ErrorMessage>{message}</ErrorMessage>}
        <div className="col-sm-4 mb-3">
          <label className="htmlForm-label mb-0 ms-1 " htmlFor="searchField">
            <small className="text-white">AuthorName / BookName</small>
          </label>

          <div className="d-flex">
            <input
              className="form-control"
              id="searchField"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search"
              aria-label="Username"
            />
            <button
              onClick={() => searchBook(search)}
              className="ms-2 btn btn-primary"
            >
              Search
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Sno.</th>
                <th scope="col">Book Name</th>
                <th scope="col">Author Name</th>
                <th scope="col">Year of Publication</th>
                <th scope="col">Number of Copies Available</th>
                <th scope="col">Issue</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, i) => {
                return (
                  <tr key={i}>
                    <td scope="col">{i + 1}</td>

                    <th scope="col">{book.bookName}</th>
                    <td scope="col">{book.authorName}</td>
                    <td scope="col">{book.year}</td>
                    <td scope="col">
                      <span className="px-4">{book.noOfCopies}</span>{" "}
                    </td>
                    <th scope="col">
                      <button
                        onClick={() => issueBook(book._id)}
                        className="btn d-flex align-items-center  btn-outline-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-plus-lg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                          />
                        </svg>
                        <span>Add to Basket</span>
                      </button>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
