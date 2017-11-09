### Create Project

```dos
cd todoservice
dotnet new webapi
```

### Dotnet Watch Tooling

```xml
<ItemGroup>
    <DotNetCliToolReference Include="Microsoft.DotNet.Watcher.Tools" Version="2.0.0" />
</ItemGroup>
```

### TodoItem Class and Data

```cs
using System;
using System.Collections.Generic;

namespace TodoService
{

    public class TodoItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Completed { get; set; }
        public DateTime Entered { get; set; }

        public static List<TodoItem> CreateList()
        {
            return new List<TodoItem> {
    new TodoItem {
        Id="1111-111-11111",
        Title = "Dev Intersection Presentation",
        Description = "Presentation at MGM Grand. Angular and ASP.NET ",
        Entered = DateTime.UtcNow,
    },
    new TodoItem {
        Id="3333-333-33333",
        Title = "Hang out at the Pub after Presentation",
        Description = "Light beer swilling and socializing after the presentation into the weee hours.",
        Entered = DateTime.UtcNow.AddHours(1)
    },
    new TodoItem {
        Title = "Fly back to Maui",
        Description = "Make the long slog of a drive back home to Hood River.",
        Entered = DateTime.UtcNow.AddDays(3)
    },
    new TodoItem {
        Title = "Fret and Worry",
        Description = "It's never done. Just one more tweak to the code - before the machine blue screens.",
        Entered = DateTime.UtcNow.AddHours(6),
        Completed = true
    },
    new TodoItem {
        Title = "Get a good night's Sleep",
        Description = "Snoooooore!!!!",
        Entered = DateTime.UtcNow.AddHours(6),
        Completed = true
    }
};
        }
    }

}
```

### Todo Controller
```cs
public class TodoController : Controller
{
    public static List<TodoItem> TodoItems { get; set; }

    private object UpdateLock = new object();

    static TodoController()
    {
        TodoItems = TodoItem.CreateList();
    }

    [Route("api/todos")]
    public IEnumerable<TodoItem> Todos()
    {
        return TodoItems;
    }

    [Route("api/todos/reload")]
    public IEnumerable<TodoItem> ReloadTodos()
    {
        TodoItems = TodoItem.CreateList();
        return TodoItems;
    }

    [Route("api/todo/{id}")]
    public TodoItem Todo(string id)
    {
        return TodoItems.FirstOrDefault(td => td.Id == id);
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
    
    [HttpGet]
    [Route("api/todo/completed/{id}")]
    public bool SetCompleted(string id)
    {
        var todo = Todo(id);
        if (todo == null)
            return false;

        todo.Completed = !todo.Completed;
        return todo.Completed;
    }

    [HttpDelete]
    [Route("api/todo/{id}")]
    public bool DeleteTodo(string id)
    {
        if (string.IsNullOrEmpty(id))
            return false;

        var item = TodoItems.FirstOrDefault(td => id == td.Id);
        if (item != null)
        {
            lock (UpdateLock)
            {
                TodoItems.Remove(item);
            }
            return true;
        }

        return false;
    }


}
```        

### Add Cors Support

```cs
services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
```

### Todo Controller

```cs
    [EnableCors("CorsPolicy")]
    public class TodoController : Controller
    {
        public static List<TodoItem> TodoItems { get; set; }

        private object UpdateLock = new object();

        static TodoController()
        {
            TodoItems = TodoItem.CreateList();
        }

        [Route("api/todos")]
        public IEnumerable<TodoItem> Todos()
        {
            return TodoItems;
        }

        [Route("api/todos/reload")]
        public IEnumerable<TodoItem> ReloadTodos()
        {
            TodoItems = TodoItem.CreateList();
            return TodoItems;
        }

        [Route("api/todo/{id}")]
        public TodoItem Todo(string id)
        {
            return TodoItems.FirstOrDefault(td => td.Id == id);
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

        [HttpGet]
        [Route("api/todo/completed/{id}")]
        public bool SetCompleted(string id)
        {
            var todo = Todo(id);
            if (todo == null)
                return false;

            todo.Completed = !todo.Completed;
            return todo.Completed;
        }

        [HttpDelete]
        [Route("api/todo/{id}")]
        public bool DeleteTodo(string id)
        {
            if (string.IsNullOrEmpty(id))
                return false;

            var item = TodoItems.FirstOrDefault(td => id == td.Id);
            if (item != null)
            {
                lock (UpdateLock)
                {
                    TodoItems.Remove(item);
                }
                return true;
            }

            return false;
        }


    }
```

### Route Fallback to serve Index.html

```cs
//handle client side routes that fall through
app.Run(async (context) =>
{
    context.Response.ContentType = "text/html";
    await context.Response.SendFileAsync(Path.Combine(env.WebRootPath, "index.html"));
});
```

### Web.config for IIS with Rewrite Rules

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
	<system.webServer>
		<rewrite>
			<rules>
				<rule name="empty-root-index" stopProcessing="true">
					<match url="^$" />
					<action type="Rewrite" url="wwwroot/index.html" />
					<conditions logicalGrouping="MatchAll">
						<add input="{REQUEST_METHOD}" matchType="Pattern" pattern="DEBUG" ignoreCase="true" negate="true" />
					</conditions>
				</rule>		

				<rule name="wwwroot-static" stopProcessing="true">
					<match url="([\S]+[.](html|htm|svg|js|css|png|gif|jpg|jpeg|woff|woff2))" />
					<action type="Rewrite" url="wwwroot/{R:1}" />
				</rule>

				<rule name="AngularJS-Html5-Routes" stopProcessing="false">
					<match url=".*" />
					<conditions logicalGrouping="MatchAll">
						<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
						<add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
						<add input="{REQUEST_URI}" pattern="/api/" negate="true" />					
					</conditions>
					<action type="Rewrite" url="wwwroot/index.html" />
				</rule>
			</rules>
		</rewrite>

		<handlers>
			<add name="StaticFileModuleHtml" path="*.htm*" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
			<add name="StaticFileModuleSvg" path="*.svg" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
			<add name="StaticFileModuleJs" path="*.js" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
			<add name="StaticFileModuleCss" path="*.css" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
			<add name="StaticFileModuleJpeg" path="*.jpeg" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
			<add name="StaticFileModuleJpg" path="*.jpg" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
			<add name="StaticFileModulePng" path="*.png" verb ="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
			<add name="StaticFileModuleGif" path="*.gif" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
			<add name="StaticFileModuleWoff" path="*.woff*" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />


			<add name="aspNetCore" path="*" verb="*" 
								modules="AspNetCoreModule" 
								resourceType="Unspecified" />
		
		</handlers>

		<aspNetCore processPath="%LAUNCHER_PATH%" arguments="%LAUNCHER_ARGS%" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" forwardWindowsAuthToken="false"/>
	</system.webServer>
</configuration>
```