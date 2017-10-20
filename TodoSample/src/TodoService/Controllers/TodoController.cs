using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace TodoService.Controllers
{
    [EnableCors("CorsPolicy")] 
    public class TodoController : Controller
    {
        public static List<TodoItem> TodoItems = TodoItem.CreateList();

        public static object UpdateLock = new object();

        [Route("api/todos")]
        public List<TodoItem> Todos() {
            return TodoItems;
        }

        [Route("api/todo/{id}")]
        public TodoItem GetTodo(string id){
            return TodoItems.FirstOrDefault(td => td.Id == id);
        }

         [Route("api/todo/title/{title}")]
        public TodoItem GetTodoByTitle(string title){
            return TodoItems.FirstOrDefault(td => td.Title.ToLower() == title.ToLower());
        }

        [HttpPost]
        [Route("api/todo")]
        public TodoItem UpdateTodo([FromBody] TodoItem todo)
        {
            if (todo == null)
                return null;

            var idx = TodoItems.FindIndex(td => todo.Id == td.Id);
            lock (UpdateLock)
            {
                if (idx < 0)
                {
                    todo.Id = Guid.NewGuid().ToString();
                    TodoItems.Add(todo);
                }
                else
                    TodoItems[idx] = todo;
            }
            return todo;
        }

        
        [Route("api/todo/completed/{id}")]
        public bool MarkCompleted(string id, bool completed = true)
        {
            var idx = TodoItems.FindIndex(td => td.Id == id);
            lock (UpdateLock)
            {
                if (idx > -1)
                    TodoItems[idx].Completed = completed;
                else
                    throw new ArgumentException("Invalid todo item.");
            }

            return true;
        }

        [HttpDelete]
        [Route("api/todo/{title}")]
        public bool DeleteTodo(string title)
        {
            if (string.IsNullOrEmpty(title))
                return false;

            var idx = TodoItems.FindIndex(td => title.ToLower() == td.Title?.ToLower());
            if (idx > -1)
            {
                lock (UpdateLock)
                {
                    TodoItems.Remove(TodoItems[idx]);
                }
                return true;
            }

            return false;
        }

    }
}
