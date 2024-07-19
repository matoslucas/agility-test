export type InputFormProps = {
  label: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  id?: string | undefined;
  placeholder?: string | undefined;
};

const InputForm: React.FC<InputFormProps> = (props: InputFormProps) => {
  const { label, type, id, placeholder } = props;
  return (
    <>
      {label && (
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}
      
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          id={id}
          type={type}
          placeholder={placeholder}
        />
      
    </>
  );
};

export default InputForm;
