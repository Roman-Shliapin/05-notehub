import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import Loading from "../Loading/Loading";
import { useEffect, useState } from "react";
import NoteList from "../NoteList/NoteList";
import { useDebounce } from "use-debounce";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (page !== 1) {
      setPage(1);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () =>
      fetchNotes({
        search: debouncedSearch || undefined,
        page,
        perPage: 12,
      }),
    placeholderData: keepPreviousData,
  });


  useEffect(() => {
    if (error) {
      toast.error("Failed to load notes");
    }
  }, [error]);


  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isLoading ? (
        <Loading />
      ) : (
        <NoteList notes={data?.notes || []} />
      )}
      <Toaster position="top-center" reverseOrder={false} />
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default App;
