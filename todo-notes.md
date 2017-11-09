### Angular CLI Styles and Scripts

```json
"styles": [
"../node_modules/bootstrap/dist/css/bootstrap.css",
"../node_modules/bootstrap/dist/css/bootstrap-theme.css",
"../node_modules/font-awesome/css/font-awesome.css",
"../node_modules/toastr/build/toastr.css",
"todo.css"
],
"scripts": [
    "../node_modules/jquery/dist/jquery.js",
    "../node_modules/toastr/toastr.js",
    "../node_modules/bootstrap/dist/js/bootstrap.js"
],
```

### Modules to add

* FormsModule
* HttpClientModule

### Hello World Name Binding

```
<label>What's your name:</label>
    <input id="name" placeholder="Enter your name" [(ngModel)]="name"
class="form-control" />
<hr>

<div class="alert alert-info">
    Welcome back {{name}}.
</div>
 ```

### Router Links

```html
<div class="well well-sm">
  <a routerLink="hello" class="btn btn-sm btn-default">
    <i class="fa fa-home" aria-hidden="true"></i>
    Hello
  </a>  
  <a routerLink="todo" class="btn btn-sm btn-default">
    <i class="fa fa-list-alt" aria-hidden="true"></i>  
    Todos
  </a> 
</div>
```

### Todo Routes

```ts
const routes: Routes = [
    { path: '', redirectTo: 'todo', pathMatch: 'full'},
    { path: 'hello', component: HelloComponent, pathMatch: 'full'},
    { path: 'todo', component: TodoComponent, pathMatch: 'full'},
];
```

### Todo Class

```ts
export class TodoItem {
    id = "";
	title = "";
	description = "";
	entered = new Date();
	completed:boolean = false;
}
```

```ts
todos: TodoItem[] = [
    {
        id: "",
        title: "Dev Intersection presentation",
        description: "Try to show up on time this time",
        entered: new Date(),
        completed: false
    },
    {
        id: "",
        title: "Do Angular presentation",
        description: "Should go good, let's hope I don't crash n' burn...",
        entered: new Date(),
        completed: false
    },
    {
        id: "",
        title: "Fret and worry until Presentation",
        description: "It's never done... 'just one more tweak'.",
        entered: new Date(),
        completed: false
    },
    {
        id: "",
        title: "Arrive at conference",
        description: "Arrive in Vegas and catch a cab to hotel",
        entered: new Date(),
        completed: true
    }
];
activeTodo: TodoItem = new TodoItem();
```

### Todo List Template Rendering

```html
<div *ngFor="let todo of todos"
     class="todo-item"
     [ngClass]="{completed: todo.completed}">

    <div class="pull-left" (click)="toggleCompleted(todo)">
        <i class="fa "
           [ngClass]="{'fa-bookmark-o': !todo.completed,'fa-check': todo.completed }"
           style="cursor: pointer">
        </i>
        <!-- <input type="checkbox"
        title="check to complete todo"
        [(ngModel)]="todo.completed" /> -->
    </div>

    <div class="pull-right">
        <i class="fa fa-remove"
           (click)="removeTodo(todo)"
           style="color: darkred; cursor: pointer"></i>
    </div>

    <div class="todo-content">
        <div class="todo-header">
            {{ todo.title}}
        </div>
        <div>
            {{todo.description}}
        </div>
    </div>
</div>
```

### Remove Todo

```js
removeTodo(todo:TodoItem) {
    this.todos = this.todos.filter(
      (td) => td != todo);
}
```

### Todo Entry Form

```html
<div class="well">
    <form name="form1" id="form1" #form1="ngForm">
        <div class="form-group">
            <div class="input-group">
                    <span class="input-group-addon">
                        <i class="fa fa-bookmark"></i>
                    </span>
                <input type="text" class="form-control"
                       id="name" name="name"
                       [(ngModel)]="activeTodo.title"
                       placeholder="Enter the title for this ToDo"
                       required />
            </div>
        </div>

        <div class="form-group">
            <!--<label class="control-label" for="form-group-input">Description:</label>-->
            <textarea class="form-control"
                      id="description" name="description"
                      style="height: 100px"
                      [(ngModel)]="activeTodo.description"
                      minlength="10"
                      placeholder="Enter the description for this placeholder"
                      required></textarea>
        </div>

        <button class="btn btn-primary" type="button"
                (click)="addTodo(activeTodo,form1)"
                [disabled]="form1.invalid">
            <i class="fa fa-plus"></i> Add Todo
        </button>
        <button class="btn btn-primary" type="button"
                (click)="loadTodos()">
            <i class="fa fa-download"></i>
            Load ToDos</button>
    </form>
</div>
```

### Add Todo

```ts
 addTodo(todo: TodoItem, form1: HTMLFormElement) {
    this.todos.unshift(todo);
    this.activeTodo = new TodoItem();
}
```


### Add Observables Extra Methods

```ts
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
```
### Declare Var Syntax

```ts
declare var $:any;
declare var toastr:any;
declare var window:any;
```

### Todo Service

```ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TodoService {

  todos: TodoItem[] = [];
  activeTodo = new TodoItem();

  baseUrl = "http://localhost:5000/";

  constructor(private http: HttpClient) { }

  getTodos(): Observable<TodoItem[]> {
    return this.http
      .get<TodoItem[]>(this.baseUrl + "api/todos")
      .map((todoList) => this.todos = todoList);
  }

  getTodo(id: String): Observable<TodoItem> {
    return this.http.get<TodoItem>(this.baseUrl + "api/todo/" + id)
      .map((todo) => this.activeTodo = todo);
  }

  completeTodo(todo): Observable<Boolean> {
    return this.http
      .get<Boolean>(this.baseUrl + "api/todo/completed/" + todo.id);
  }

  updateTodo(todo: TodoItem): Observable<TodoItem> {
    return this.http
      .post<TodoItem>(this.baseUrl + "api/todo", todo)
      .map((todo) => this.activeTodo = todo);
  }
}
```