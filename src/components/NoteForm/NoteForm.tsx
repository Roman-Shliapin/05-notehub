import { Formik, ErrorMessage, useFormikContext } from "formik";
import type { NoteTag } from "../../types/NoteTag";
import css from "./NoteForm.module.css";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import toast from "react-hot-toast";

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

interface NoteFormProps {
  onCancel: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

function NoteFormInner({ onCancel }: NoteFormProps) {
  const { values, handleChange, handleBlur, isSubmitting, isValid } =
    useFormikContext<FormValues>();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully");
      onCancel();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  return (
    <form
      className={css.form}
      onSubmit={(e) => {
        e.preventDefault();
        createMutation.mutate(values);
      }}
    >
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <ErrorMessage name="title" component="span" className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={values.content}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <ErrorMessage name="content" component="span" className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={values.tag}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <ErrorMessage name="tag" component="span" className={css.error} />
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting || createMutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}

function NoteForm({ onCancel }: NoteFormProps) {
  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        tag: "Todo" as NoteTag,
      }}
      validationSchema={validationSchema}
      validateOnMount={true}
      onSubmit={() => {}}
    >
      <NoteFormInner onCancel={onCancel} />
    </Formik>
  );
}


export default NoteForm;