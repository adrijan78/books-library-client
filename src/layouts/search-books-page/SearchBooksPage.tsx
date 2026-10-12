import { useCallback, useEffect, useState } from "react";
import type { BookModel } from "../../models/BookModel";
import { SearchBook } from "./components/SearchBook";
import { bookService } from "../../services/BookService";
import { SpinnerLoading } from "../../components/SpinnerLoading";
import { Pagination } from "../../components/Pagination";

// const dummyBooks: BookModel[] = [
//   {
//     id: 1,
//     author: "Author One",
//     title: "Book Title One",
//     description: "Description for book one.",
//     img: "/images/book-images/book-1.png",
//   },
//   {
//     id: 2,
//     author: "Author Two",
//     title: "Book Title Two",
//     description: "Description for book two.",
//     img: "/images/book-images/book-2.png",
//   },
//   {
//     id: 3,
//     author: "Author Three",
//     title: "Book Title Three",
//     description: "Description for book three.",
//     img: "/images/book-images/book-3.png",
//   },
// ];

export const SearchBooksPage = () => {

  const BOOKS_PER_PAGE = 5;
  const CATEGORIES: { label: string; value: string }[] = [
    {label:"ALL", value:"all"},
    {label:"FRONT END", value:"FE"},
    {label:"BACK END", value:"BE"},
    {label:"DATA", value:"data"},
    {label:"DEVOPS", value:"devops"},
  ] as const;

  const [books,setBooks]= useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalBooks,setTotalBooks] = useState<number>(0);
  const [totalPages,setTotalPages]= useState<number>(0);


  const [searchInput, setSearchInput] = useState<string>("");
  const[searchTerm,setSearchTerm] = useState<string>("");

  const[selectedCategory,setSelectedCategory] = useState<string>("all");

  useEffect(()=>{
    const fetchBooks = async()=>{

      try {
        const pageNo = currentPage - 1;

        let data;

        if(searchTerm){
          data = await bookService.searchBooksByTitle(searchTerm,pageNo,BOOKS_PER_PAGE);
        }else if(selectedCategory !== "all") {
          data = await bookService.searchBooksByCategory(selectedCategory,pageNo,BOOKS_PER_PAGE);
        } else {
          data = await bookService.getBooks(pageNo, 5);
        }
        setBooks(data.content);
        setTotalBooks(data.page.totalElements);
        setTotalPages(data.page.totalPages);
        setIsLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching books:", error);
        setIsLoading(false);
        setHttpError(error instanceof Error ? error.message : "An unknown error occurred");
      }

    };
    fetchBooks();
  },[currentPage,searchTerm,selectedCategory]);


  const handleSeach = useCallback(()=>{
    setCurrentPage(1);
    setSearchTerm(searchInput);
    setSelectedCategory("all");
  },[setCurrentPage,searchInput]);

  const handleInputKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>)=>{
    if(event.key === "Enter"){
      handleSeach();
    }
  },[handleSeach]);

  const handleCategorySelect = useCallback((category: string)=>{
    setCurrentPage(1);
    setSelectedCategory(category);
    setSearchTerm("");
    setSearchInput("");
  },[setCurrentPage]);

  if(isLoading){
    return <SpinnerLoading/>
  }

  if(httpError){
    return <div className="container">Error: {httpError}</div>
  }


  const indexOfFirstBook = (currentPage - 1) * BOOKS_PER_PAGE + 1;
  const lastItem = Math.min(currentPage * BOOKS_PER_PAGE, totalBooks);


  return (
    <>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-labelledby="Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
                <button className="btn btn-outline-success" onClick={handleSeach}>
                  Search
                </button>
              </div>
            </div>

            <div className="col-4">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedCategory}
                </button>

                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  {CATEGORIES.map((category) => (
                    <li key={category.value}>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => handleCategorySelect(category.value)}
                      >
                        {category.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            
            </div>
          </div>

          <div className="mt-3">
            <h5>Number of results: {totalBooks}</h5>
          </div>

          <p>{indexOfFirstBook} to {lastItem} of {totalBooks} items:</p>

          {books.map((book) => (
            <SearchBook key={book.id} book={book} />
          ))}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={setCurrentPage}
            />
          )}
        </div>
      </div>
    </>
  );
};
