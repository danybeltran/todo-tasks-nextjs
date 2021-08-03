import { useAtom } from "../src/lib/state-manager";
import { SHOW_COMPLETED, TODOS, TODO_NAME } from "../src/atoms";

export default function Home() {
  const [todos, , actions] = useAtom(TODOS);
  const [newTodoName, setNewTodoName] = useAtom(TODO_NAME);
  const [showCompleted, setShowCompleted] = useAtom(SHOW_COMPLETED);

  return (
    <div className="py-5 px-4">
      <h2>Your tasks</h2>
      <p>Total tasks: {todos.length}</p>
      <div className="row">
        <div
          style={{
            height: "35px",
          }}
          className="col-sm-5 ps-4 d-flex align-items-end"
        >
          <input
            style={{
              width: "89%",
              marginRight: "10px",
              height: "100%",
            }}
            type="text"
            placeholder="New todo"
            value={newTodoName}
            onChange={(e) => {
              setNewTodoName(() => e.target.value);
            }}
            className="form-control"
          />
          <span
            style={{
              width: "1%",
            }}
          ></span>
          <button
            style={{
              height: "100%",
            }}
            className="btn btn-primary mt-4 px-3"
            onClick={() => {
              actions.create({
                title: newTodoName,
              });
              setNewTodoName(() => "");
            }}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </div>
      <div className="row pt-4">
        <p
          className="col-sm-5"
          style={{
            textAlign: "right",
          }}
        >
          <label>
            Mostrar sólo completadas{" "}
            <input
              checked={showCompleted}
              onChange={() => {
                setShowCompleted(() => !showCompleted);
              }}
              type="checkbox"
              className="form-check-input"
            />
          </label>
        </p>
      </div>
      <div
        className="row my-4 d-flex align-items-center"
        style={{
          maxHeight: "49vh",
          overflowY: "scroll",
        }}
      >
        {(showCompleted ? todos.filter((e) => e.completed) : todos)
          .map((todo) => (
            <div
              className={`w-100 ${
                todo.completed ? "text-decoration-line-through" : "text-dark"
              }`}
              style={{
                color: todo.completed && "darkgray",
              }}
              key={todo.id}
            >
              <div className="col-sm-5 border-bottom my-1 p-3 d-flex justify-content-between">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {
                    actions.edit({
                      todo: {
                        ...todo,
                        completed: !todo.completed,
                      },
                    });
                  }}
                  className="form-check-input"
                />
                <input
                  disabled={todo.completed}
                  onChange={(e) => {
                    actions.edit({
                      todo: {
                        ...todo,
                        title: e.target.value,
                      },
                    });
                  }}
                  defaultValue={todo.title}
                  className="border-0 bg-white"
                  style={{
                    overflowY: "hidden",
                    resize: "none",
                    border: "0px",
                    outline: "none",
                    width: "85%",
                  }}
                />
                <button
                  className="btn-close"
                  onClick={() => {
                    const deleteConfirmation = confirm(
                      `¿Deseas eliminar "${todo.title}"?`
                    );
                    if (deleteConfirmation) {
                      actions.delete(todo);
                      // alert(`Se borró "${todo.title}" de tus tareas`);
                    }
                  }}
                ></button>
              </div>
            </div>
          ))
          .reverse()}
      </div>
    </div>
  );
}
