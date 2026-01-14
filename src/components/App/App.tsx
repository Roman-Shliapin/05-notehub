import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { deleteNote, fetchNotes, createNote } from "../../services/noteService";
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

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to create note");
    },
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
        <Pagination
          pageCount={data?.totalPages || 0}
          currentPage={page}
          onPageChange={setPage}
        />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isLoading ? (
        <Loading />
      ) : (
        <NoteList
          notes={data?.notes || []}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}
      <Toaster position="top-center" reverseOrder={false} />
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={(values) => createMutation.mutate(values)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
