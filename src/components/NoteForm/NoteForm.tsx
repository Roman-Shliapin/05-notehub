import { useFormik } from "formik";
import type { NoteTag } from "../../types/NoteTag";
import css from "./NoteForm.module.css";
import * as Yup from "yup";

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
  onSubmit: (values: { title: string; content: string; tag: NoteTag }) => void;
  onCancel: () => void;
}

function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo" as NoteTag,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <span className={css.error}>
          {formik.touched.title && formik.errors.title}
        </span>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <span className={css.error}>
          {formik.touched.content && formik.errors.content}
        </span>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={formik.values.tag}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <span className={css.error}>
          {formik.touched.tag && formik.errors.tag}
        </span>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={formik.isSubmitting || !formik.isValid}
        >
          Create note
        </button>
      </div>
    </form>
  );
}


export default NoteForm;