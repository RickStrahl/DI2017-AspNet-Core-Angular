using System;
using System.Collections.Generic;

namespace TodoService.Controllers {

    public class TodoItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Completed { get; set; }
        public DateTime Entered { get; set; }

        public static List<TodoItem> CreateList()
        {
            return new List<TodoItem>
            {
                new TodoItem
                {
                    Id = "1111-111-1111",
                    Title = "Dev Intersection Presentation",
                    Description = "Presentation at MGM Grand. Angular and ASP.NET ",
                    Entered = DateTime.UtcNow,
                },
                new TodoItem
                {
                    Title = "Hang out at the Pub after Presentation",
                    Description = "Light beer swilling and socializing after the presentation into the weee hours.",
                    Entered = DateTime.UtcNow.AddHours(1)
                },
                new TodoItem
                {
                    Id = "3333-333-33333",
                    Title = "Fly back to Maui",
                    Description = "Make the long slog of a drive back home to Hood River.",
                    Entered = DateTime.UtcNow.AddDays(3)
                },
                new TodoItem
                {
                    Title = "Get a good night's Sleep",
                    Description = "Snoooooore!!!!",
                    Entered = DateTime.UtcNow.AddHours(6)
                },
                new TodoItem
                {
                    Title = "Fret and Worry",
                    Description = "It's never done. Just one more tweak to the code - before the machine blue screens.",
                    Entered = DateTime.UtcNow.AddHours(6),
                    Completed = true
                },
                new TodoItem
                {
                    Title = "Prepare Dev Intersection Sessions",
                    Description = "Why oh why am I doing this again?",
                    Entered = DateTime.UtcNow.AddDays(2),
                    Completed = true
                }
            };
        }
    }

}