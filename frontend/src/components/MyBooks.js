import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loding from "./Loding";

const MyBooks = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [books,setBooks]=useState([]);
  const[error,setError]=useState(null);
  useEffect(() => {
    let id = searchParams.get("id");
    getBooksforId(id);
  }, []);

  // to get Books for a particular UserID
  const getBooksforId=async(id)=>{
    try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        setLoading(true);
        const { data } = await axios
          .post(
            "/api/book/myBooks",
            {
              id:id
            },
            config
          )
          .then((res) => {
            if (res.status === 200) {
            //   setUpdateMessage("Book Issued successfully");
              let data = res.data.data.myBooks;
              setBooks(data);
                console.log(data);
            }
          });
        setLoading(false);
      } catch (error) {
        setError('Cannot able to fetch books');
        setLoading(false);
      }
  }


  return (
    <div className="myBooksBg">
    <div className="container position-relative">
      <div className="fs-4 my-3 text-white fw600">My Books:-</div>
          {loading && <Loding />}
          <div className="table-responsive">
      <table className=" table table-bordered">
        <thead>
          <tr>
            <th scope="col">Sno.</th>
            <th scope="col">Book Name</th>
            <th scope="col">Author Name</th>
            <th scope="col">Year of Publication</th>
            <th scope="col">Number of Copies Issued</th>
          </tr>
        </thead>
        <tbody>
          {books.length>0? books.map((book, i) => {
            return (
              <tr key={i}>
                <th scope="col">{i + 1}</th>
                <th scope="col">{book.bookName}</th>

                <th scope="col">{book.authorName}</th>
                <th scope="col">{book.year}</th>
                <th scope="col">
                  <span className="px-4">{book.noOfCopies}</span>{" "}
                </th>
             
              </tr>
            );
          }):<td  colspan="5" className="p-3 fs-4 text-center">You have no books currently ! </td>}
        </tbody>
      </table>
      </div>
    </div>
    </div>
  );
};

export default MyBooks;
