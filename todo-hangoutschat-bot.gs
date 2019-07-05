/**
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {object} event the event object from Hangouts Chat
 */
function onMessage(event) {
  console.log(event);
  var userName = '';
  if (event.space.type == "DM") {
    userName = 'You';
  } else {
    userName = event.user.displayName;
  }
  var taskText = event.message.text.replace('@todo-bot', '').trim();
  if (taskText == '') {
    taskText = 'no text only thread url.';
  }
  var taskList = getTaskList('Chat');

  if (!taskList) {
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
  var message = 'added the task to todo-list named(' + *taskList.title* + ') of userName.\ntitle:' + task.title + '\nnotes:' + task.notes;
  return { "text": message };
}

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {object} event the event object from Hangouts Chat
 */
function onAddToSpace(event) {
  var message = 'add a task to todo-list named *Chat* or default todo-list.';
  if (!event.message || !event.message.text) {
    return { "text": message };
  }
  console.log('[onAddToSpace]' + '<room>name=' + event.space.name + ',displayName=' + event.space.displayName + '<user>name=' + event.user.name + ',displayName=' + event.user.displayName);
  
  return onMessage(event);
}

/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {object} event the event object from Hangouts Chat
 */
function onRemoveFromSpace(event) {
  console.info("[onRemoveFromSpace]Bot removed from ", event.space.displayName);
}

/**
 * Adds a task to a tasklist.
 * @param {string} taskListId The tasklist to add to.
 * @param {object} to post task{title, notes}
 */
function addTask(taskListId, task) {
  task = Tasks.Tasks.insert(task, taskListId);
  return task;
}

/**
* getTaskList by listName
*
* @param {listName} taskList.title
*/
function getTaskList(listName) {
  var taskLists = Tasks.Tasklists.list();
  if (taskLists.items) {
    for (var i = 0; i < taskLists.items.length; i++) {
      var taskList = taskLists.items[i];
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
