/**
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onMessage(event) {
  console.log(event);
  var userName = '';
  if (event.space.type == "DM") {
    userName = 'your';
  } else {
    userName = event.user.displayName;
  }
  var taskText = event.message.text.replace('@todo-bot', '').trim();
  if (taskText == '') {
    taskText = 'no text(only thread direct link)';
  }
  var taskList = getTaskList('Chat');

  if (!taskList) {
    // it doesn’t access Tasks, contact your G Suite administrator
    var message = 'add a task to todo-list named *Chat* or default todo-list.';
    return { "text": message };
  }
  
  // https://chat.google.com/room/<room-name>/<thread-name>
  var threadURL = 'https://chat.google.com/room/' + event.message.thread.name.replace('spaces/', '').replace('threads/', '') ;
  var task = {
    title: '[' + event.space.displayName + ']' + taskText,
    notes: threadURL
  };
  // console.log(task);
  
  addTask(taskList.id, task);
//  var message = 'added the task to todo-list named(' + *taskList.title* + ') of userName.\ntitle:' + task.title + '\nnotes:' + task.notes;
//  return { "text": message };
  
  // card format
  return {
  "cards": [
    {
      "header": {
        "title": "added the task",
        "subtitle": "futa23/todo-hangoutschat-bot",
        "imageUrl": "https://www.gstatic.com/companion/icon_assets/tasks2_2x.png"
      },
      "sections": [
        {
          "widgets": [
            {
              "keyValue": {
                "icon": "BOOKMARK",
                "topLabel": userName + "'s todo-list ",
                "content": taskList.title,
              }
            },
            {
              "keyValue": {
                "icon": "DESCRIPTION",
                "topLabel": "Room",
                "content": event.space.displayName
              }
            },
            {
              "keyValue": {
                "topLabel": "Title",
                "content": taskText,
                "contentMultiline": "true"
              }
            },
            {
              "keyValue": {
                "topLabel": "Notes(Thread Direct Link)",
                "content": task.notes,
                "contentMultiline": "true"
              }
            }
          ]
        },
        {
          "widgets": [
              {
                  "buttons": [
                    {
                      "textButton": {
                        "text": "Open Tasks(help)",
                        "onClick": {
                          "openLink": {
                            "url": "https://support.google.com/a/users/answer/9310341?hl=ja&ref_topic=9298644"
                          }
                        }
                      }
                    }
                  ]
              }
            ]
        }
      ]
    }
  ]
  };
}

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onAddToSpace(event) {
  if (!event.message || !event.message.text) {
    var message = 'add a task to todo-list named *Chat* or default todo-list.\n + `@todo-bot task title`';
    return { "text": message };
  }
  console.log('[onAddToSpace]' + '<room>name=' + event.space.name + ',displayName=' + event.space.displayName + '<user>name=' + event.user.name + ',displayName=' + event.user.displayName);
  
  return onMessage(event);
}

/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onRemoveFromSpace(event) {
  console.log("[onRemoveFromSpace]Bot removed from " + '<room>name=' + event.space.name + ',displayName=' + event.space.displayName + '<user>name=' + event.user.name + ',displayName=' + event.user.displayName);
}

/**
 * Adds a task to a tasklist.
 * @param {string} taskListId The tasklist to add to.
 * @param {Object} to post task{title, notes}
 */
function addTask(taskListId, task) {
  task = Tasks.Tasks.insert(task, taskListId);
  return task;
}

/**
* getTaskList by listName
*
* @param {string} taskList.title
*/
function getTaskList(listName) {
  var taskLists = Tasks.Tasklists.list();
  if (taskLists.items) {
    for (var i = 0; i < taskLists.items.length; i++) {
      var taskList = taskLists.items[i];
      // return mathed taskList.title
      if(listName && taskList.title == listName) {
        return taskList;
      }
    }
  }

  if (listName && taskLists.items) {
    // default when not matched
    return taskLists.items[0];
  }    
  return null;
}
