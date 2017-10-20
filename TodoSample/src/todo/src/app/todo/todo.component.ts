import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {TodoItem, TodoService} from "./todo.service";

declare var toastr:any;

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

    todos: TodoItem[] = [];
    //     [
    //     {
    //         id: "",
    //         title: "Dev Intersection presentation",
    //         description: "Try to show up on time this time",
    //         entered: new Date(),
    //         completed: true
    //     },
    //     {
    //         id: "",
    //         title: "Do Angular presentation",
    //         description: "Should go good, let's hope I don't crash n' burn...",
    //         entered: new Date(),
    //         completed: false
    //     },
    //     {
    //         id: "",
    //         title: "Do raffle at the end of day one",
    //         description: "Should go good, let's hope I don't fail...",
    //         entered: new Date(),
    //         completed: false
    //     },
    //     {
    //         id: "",
    //         title: "Arrive at conference",
    //         description: "Arrive in Vegas and catch a cab to hotel",
    //         entered: new Date(),
    //         completed: true
    //     }
    // ];
    activeTodo: TodoItem = new TodoItem();
    baseUrl = "http://localhost:5000/";

    constructor(private http: HttpClient, private service: TodoService) {

    }

    ngOnInit() {
        this.activeTodo = this.service.activeTodo;
        this.loadTodos();
    }

    toggleCompleted(todo: TodoItem) {
        todo.completed = !todo.completed;
        this.service.setCompleted(todo)
            .subscribe( isSuccess=> { toastr.info('Status updated on server.');},
            err=> toastr.warning("failed to update completed on the server."));
    }

    removeTodo(todo: TodoItem) {
        this.service.deleteTodo(todo)
            .subscribe()

        this.todos = this.todos.filter(td => td.title !== todo.title);
    }

    addTodo(todo: TodoItem, form1: HTMLFormElement) {

        this.service.updateTodo(todo)
            .subscribe(td => {
                this.todos.unshift(todo);
                this.activeTodo = new TodoItem();
              
                form1.reset();
            });
    }

    loadTodos() {
        this.service.loadTodos()
            .subscribe((todoList) => {
                this.todos = todoList;
            }, error => toastr.warning("download failed."));
    }
}

