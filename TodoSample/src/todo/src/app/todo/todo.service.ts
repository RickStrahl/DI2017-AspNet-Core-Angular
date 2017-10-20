import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TodoService {
    todos: TodoItem[] = [];
    activeTodo: TodoItem = new TodoItem();
    baseUrl = "http://localhost:5000/";

    constructor(private http: HttpClient) {

    }

    loadTodos(): Observable<TodoItem[]> {
        return this.http.get<TodoItem[]>(`${this.baseUrl}api/todos`)
            .map((todoList) => {
                this.todos = todoList;
                return this.todos;
            });

    }

    updateTodo(todo): Observable<TodoItem> {
        return this.http.post<TodoItem>(`${this.baseUrl}api/todo`, todo)
            .map( td=> {
                const idx = this.todos.findIndex( tdx=> tdx.id === todo.id);
                if (idx > -1)
                    this.todos[idx] = td;
                else
                    this.todos.unshift(td);
                this.activeTodo = td;
                return td;
            });
    }

    setCompleted(todo): Observable<boolean> {
        return this.http.get(`${this.baseUrl}api/todo/completed/${todo.id}?completed=${todo.completed}`)
            .map((isSuccess) => {
                const idx = this.todos.findIndex( td=> td.id === todo.id);
                if (idx > -1)
                    this.todos[idx].completed = todo.completed;
                return isSuccess;
            });
    }

    deleteTodo(todo):Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}/api/todo/${todo.id}`)
            .map(isSuccess=> {
                const idx = this.todos.findIndex( td=> td.id === todo.id);
                if (idx > -1)
                    this.todos.splice(idx,1);
                return isSuccess;
            });
    }
}

export class TodoItem {
    id = "";
    title = "";
    description = "";
    entered = new Date();
    completed = false;
}
