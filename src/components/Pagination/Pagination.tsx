import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

function Pagination ({pageCount, currentPage, onPageChange}: PaginationProps) {
  if (pageCount <= 1) return null;


  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={(selectedItem) => {
        onPageChange(selectedItem.selected + 1);
      }}
      containerClassName={css.pagination}
      pageLinkClassName={css.pageLink}
      activeClassName={css.active}
      activeLinkClassName={css.activeLink}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
    />
  );
}


export default Pagination;