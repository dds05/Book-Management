import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import axios from "axios";
import Loding from "./Loding";
import ErrorMessage from "./ErrorMessage";
import Header from "./Header";
const AdminDashboard = () => {
  // Modal variables
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  // General variables
  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [year, setYear] = useState("");
  const [noOfCopies, setnoOfCopies] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [updateMsg, setUpdateMsg] = useState(null);
  const [idtoDelete, setIdtoDelete] = useState(null);
  const [bookName, setBookName] = useState(null);
  const [modalError, setModalError] = useState(null);

  const idRef = useRef();
  //  to fetch all the books on page load
  useEffect(() => {
    getAllBooks();
  }, []);
  useEffect(() => {
    const timeoutId = idRef.current;
    // console.log(timeoutId);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [updateMsg]);

  // close Event Handler for addBook_Model and deleteBook_Modal
  const handleClose = (val) => {
    if (val == "add") {
      setShow(false);
      setMessage(null);
      setModalError(null);
    } else {
      setShow2(false);
      setMessage(null);
      setModalError(null);
    }
  };

  // open Event Handler for ddBook_Model and deleteBook_Modal
  const handleShow = (val) => {
    if (val == "add") {
      setMessage(null);
      setModalError(null);
      setShow(true);
    } else {
      setMessage(null);
      setModalError(null);
      setShow2(true);
    }
  };

  // fetch all Books from DB->books collection
  const getAllBooks = () => {
    try {
      setLoading(true);
      axios.get("/api/book/get").then((res) => {
        let data = res.data.data;
        setBooks(data);
      });
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  //  to increment or decrement number of copies of a particular book
  const updateBook = async (id, operation) => {
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
          "/api/book/update",
          {
            id,
            operation: operation,
          },
          config
        )
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);
            setUpdateMsg("Updation is done successfully!");

            const timeout = setTimeout(() => {
              setUpdateMsg(null);
            }, 2000);
            idRef.current = timeout;

            let quantityLeft = res?.data?.data?.noOfCopies;
            if (quantityLeft == 1 && operation == "subtract") {
              deleteBook(id);
            }
            getAllBooks();
          }
        });
    } catch (error) {
      // setError(error.response.data.message);
      setLoading(false);
    }
  };

  // delete a particular book
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
            setLoading(false);
            setMessage("Deletion is done successfully!");
             setIdtoDelete(null);
            getAllBooks();
          }
        });
    } catch (error) {
      // setError(error.response.data.message);
      setLoading(false);
    }
  };

  //  add new book in databse
  const submitBookForm = async (e) => {
    e.preventDefault();
    // console.log(authorName,year,noOfCopies);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      setLoading(true);
      const { data } = await axios
        .post(
          "/api/book/add",
          {
            bookName,
            authorName,
            year,
            noOfCopies,
          },
          config
        )
        .then((res) => {
          if (res.status === 200) {
            setAuthorName("");
            setBookName("");
            setYear("");
            setnoOfCopies("");
            setMessage("Book Added Successfully");
            setTimeout(() => {
              setMessage(null);
            }, 3000);
            getAllBooks();
          }
        });
      setLoading(false);
    } catch (error) {
      setModalError(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div className="bgDashboard">
      <div className="container">
        <Header />
        <div className="text-end mb-2">
          <button onClick={() => handleShow("add")} className="btn btn-primary">
            +Add Book
          </button>
        </div>
        {loading && <Loding />}
        {updateMsg && <ErrorMessage>{updateMsg}</ErrorMessage>}
        <div className="table-responsive">
          <table className="  table  table-bordered ">
            <thead>
              <tr>
                <th scope="col">Sno.</th>
                <th scope="col">Book Name</th>
                <th scope="col">Author Name</th>
                <th scope="col">Year of Publication</th>
                <th scope="col">Number of Copies Available</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, i) => {
                return (
                  <tr key={i}>
                    <th scope="col">{i + 1}</th>
                    <th scope="col">{book.bookName}</th>
                    <th scope="col">{book.authorName}</th>
                    <th scope="col">{book.year}</th>
                    <th className="" scope="col d-flex">
                      <div className="d-flex justify-content-between">
                        <button
                          onClick={() => updateBook(book._id, "subtract")}
                          className="btn btn-primary"
                        >
                          {" "}
                          <svg
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-dash-lg"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"
                            />
                          </svg>
                        </button>
                        <span className="px-2">{book.noOfCopies}</span>{" "}
                        <button
                          onClick={() => updateBook(book._id, "add")}
                          className="btn btn-primary"
                        >
                          {" "}
                          <svg
                            role="button"
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
                        </button>
                      </div>
                    </th>
                    <th scope="col-span-2">
                      <button
                        onClick={() => {
                          handleShow("delete");
                          setIdtoDelete(book._id);
                        }}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Modal
          show={show2}
          backdrop="static"
          onHide={() => handleClose("delete")}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title id="warning contained-modal-title-vcenter text-warning">
              <div className="d-flex align-items-center text-warning">
                <span> Caution&nbsp;</span>{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-exclamation-triangle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5 className="my-2">
              Are You Sure you want to delete this book? It will delete all its
              copies from the database!
            </h5>
            {message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
          </Modal.Body>
          <Modal.Footer>
            <div className="w-100 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => handleClose("delete")}>
                Close
              </Button>
              <Button
                disabled={idtoDelete==null}
                onClick={() => deleteBook(idtoDelete)}
                variant="danger"
              >
                Yes, Delete
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
        <Modal
          show={show}
          backdrop="static"
          onHide={() => handleClose("add")}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add New Book
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="bookName" className="form-label">
                  Book Name
                </label>
                <input
                  onChange={(e) => setBookName(e.target.value)}
                  value={bookName}
                  type="text"
                  className="form-control"
                  id="bookName"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="author" className="form-label">
                  Author Name
                </label>
                <input
                  onChange={(e) => setAuthorName(e.target.value)}
                  value={authorName}
                  type="text"
                  className="form-control"
                  id="author"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="year" className="form-label">
                  Year of Publication
                </label>
                <input
                  onChange={(e) => setYear(e.target.value)}
                  value={year}
                  type="number"
                  className="form-control"
                  id="year"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="copies" className="form-label">
                  Number of Copies
                </label>
                <input
                  onChange={(e) => setnoOfCopies(e.target.value)}
                  value={noOfCopies}
                  type="number"
                  className="form-control"
                  id="copies"
                />
              </div>
            </form>
            {modalError && (
              <ErrorMessage variant="danger">{modalError}</ErrorMessage>
            )}
            {message && <ErrorMessage>{message}</ErrorMessage>}
          </Modal.Body>
          <Modal.Footer>
            <div className="w-100 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => handleClose("add")}>
                Close
              </Button>
              <Button
                disabled={!bookName || !authorName || !year || !noOfCopies}
                variant="primary"
                onClick={submitBookForm}
              >
                Save Changes
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
