import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container, FloatingLabel, Form, Modal, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPencil, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Base_URL, addTask, getAllTasks, deleteTask, getTasksById, updateTask, statusUpdateTask } from '../API/AllApiEndPoints';
import moment from 'moment/moment';
import { toast } from 'react-toastify';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

function Home() {
  const navigate = useNavigate();
  // * useStates
  // Data UseSates
  const [userId, setUserId] = useState()
  const [data, setData] = useState()

  // Data set when we enter values in add or update's modal
  const [addNewTodoData, setAddNewTodoData] = useState()
  const [updateTodoData, setUpdateTodoData] = useState()

  // Status for new Task 
  const [newTaskStatus, setNewTaskStatus] = useState('')

  // Values that are to be manipulated 
  const [currDeleteTaskData, setCurrDeleteTaskData] = useState()
  const [currUpdateTaskData, setCurrUpdateTaskData] = useState()


  // Modal useSates
  const [logoutShow, setLogoutShow] = useState(false);
  const [addNewTaskShow, setAddNewTaskShow] = useState(false);
  const [updateTaskShow, setUpdateTaskShow] = useState(false)
  const [deleteShow, setDeleteShow] = useState(false)

  // * Function for Modals
  const handleLogoutClose = () => setLogoutShow(false);
  const handleLogoutShow = () => setLogoutShow(true);
  const handleAddNewTaskClose = () => setAddNewTaskShow(false);
  const handleAddNewTaskShow = () => setAddNewTaskShow(true);
  const handleUpdateClose = () => setUpdateTaskShow(false);
  const handleUpdateShow = () => setUpdateTaskShow(true);
  const handleDeleteClose = () => setDeleteShow(false);
  const handleDeleteShow = () => setDeleteShow(true);

  // *Navigating to Login if there is no token
  useEffect(() => {
    if (!localStorage.getItem('login-token')) {
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  // *Calling API of Get all todo
  useEffect(() => {
    const userIdFromLocalStorage = Number(localStorage.getItem('user_id'));
    setUserId(userIdFromLocalStorage);
  }, []);
  useEffect(() => {
    if (userId) {
      getAllTodo(userId);
    }
  }, [userId]);
  // ------------------------------------------

  // *for Adding initial data on page load
  const getAllTodo = async (id) => {
    try {
      const response = await axios.get(Base_URL + getAllTasks + '?id=' + id);
      console.log(response?.data);
      setData(response?.data?.outdata?.tasks)
    } catch (error) {
      console.log(error);
    }
  };

  // * for Getting the data of Specific Task 
  const getTodoForUpdate = async (taskId) => {
    if (userId !== '' && taskId !== undefined) {
      try {
        await axios.get(Base_URL + getTasksById + `/${userId}/${taskId}`)
          .then((response) => {
            setUpdateTodoData({
              taskTitle: response?.data?.outdata?.task_title,
              taskDescription: response?.data?.outdata?.task_desc
            })
            handleUpdateShow()
          })
          .catch(err => console.log(err))
          .finally(() => {

          })


      } catch (error) {
        console.log(error);
      }
    }
    else {
      toast.error('Something went wrong...!')
    }

  };


  // *for opening Add Task modal 
  const showAddNewTask = (taskStatus) => {
    setNewTaskStatus(taskStatus);
    handleAddNewTaskShow()
  }

  // *for Updating Add Data Values
  const updateAddDataValues = async (e) => {
    const { name, value } = e.target;
    setAddNewTodoData({ ...addNewTodoData, [name]: value })

  }

  // *for Adding new task using API 
  const addNewTask = async () => {

    if (addNewTodoData.taskTitle && newTaskStatus !== '') {
      await axios.post(Base_URL + addTask,
        {
          "task_title": addNewTodoData.taskTitle,
          "task_desc": addNewTodoData.taskDescription,
          "task_status": newTaskStatus,
          "user_id": userId,
        }
      ).then((response) => {
        console.log(response)
        if (response.status) {
          toast.success(response.data.client_message);
          getAllTodo(userId)
          handleAddNewTaskClose();
        }
      }
      ).catch((error) => {
        toast.error(error.response.data.client_message);
      }).then(() => {

      })
    }
    else {
      toast.error('Task Title must not be empty.')
    }
  }

  // *for Updating task using API 
  const update_Task = async () => {
    console.log({
      "task_title": updateTodoData.taskTitle,
      "task_desc": updateTodoData.taskDescription,
      "task_status": currUpdateTaskData.task_status,
      "user_id": userId,
      "task_id": currUpdateTaskData.task_id,
    })
    if (addNewTodoData.taskTitle !== '' && currUpdateTaskData.task_status !== '' && userId !== '') {
      await axios.patch(Base_URL + updateTask,
        {
          "task_title": addNewTodoData.taskTitle,
          "task_desc": addNewTodoData.taskDescription,
          "task_status": currUpdateTaskData.task_status,
          "user_id": userId,
          "task_id": currUpdateTaskData.task_id,
        }
      ).then((response) => {
        console.log(response)
        if (response.status) {
          toast.success(response.data.client_message);
          getAllTodo(userId)
          handleUpdateClose();
        }
      }
      ).catch((error) => {
        toast.error(error.response.data.client_message);
      }).then(() => {

      })
    } else {
      toast.error('Something went wrong...!')
    }
  }

  // *for Deleting task using API 
  const delete_Task = async (deleteData) => {
    const { task_id, task_status } = deleteData

    if (task_id !== '' && task_status !== '') {
      await axios.delete(Base_URL + deleteTask + `?task_id=${task_id}&user_id=${userId}&task_status=${task_status}`)
        .then((response) => {
          console.log(response)
          if (response.status) {
            toast.success(response.data.client_message);
            getAllTodo(userId)
            setNewTaskStatus(null)
            setCurrDeleteTaskData(null)
          }
        }
        ).catch((error) => {
          toast.error(error.response.data.client_message);
        }).then(() => {
          handleDeleteClose();
        })
    }
    else {
      toast.error('Something went wrong...!')
    }

  }

  // *for Updating task using API 
  const dragUpdateStatus = async (e) => {
    console.log(e)

    let draggedId = e.draggableId;
    
    if (draggedId = "Pending") { draggedId = 1 }
    else if (draggedId = "In Progress") { draggedId = 2 }
    else if (draggedId = "Completed") { draggedId = 3 }

    const dropDestination = e.destination.droppableId;
    const dropDestinationIndex = e.destination.droppableId;

    const dragSource = e.source.droppableId;
    const dragSourceId = e.source.droppableId;

    try {
      await axios.patch(Base_URL + statusUpdateTask, {
        "task_status": 1,
        "task_id": draggedId,
        "user_id": userId
      })
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.client_message);
    }

  }




  // *Printing Data on change of data 
  // useEffect(() => {
  //   if (data) {
  //     console.log('data', data)
  //   }
  // }, [data])

  return (
    <div id='home'>

      <Navbar expand="lg" className="position-sticky top-0 bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand href="/">MPTodo</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="w-100 me-auto my-2 my-lg-0 d-flex justify-content-between"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <div>
                <Nav.Link href="/">Home</Nav.Link>
              </div>
              <div>
                <Button className='mx-1' variant='success' onClick={() => { navigate('/register') }}>Register</Button>
                <Button className='mx-1' variant='danger'
                  onClick={handleLogoutShow}
                >Logout</Button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className='p-3 main-container'>
        <div className="todo-container">
          <Row>
            <DragDropContext onDragEnd={(e) => { dragUpdateStatus(e) }}>
              <Col lg={4}>
                <div className="header h3  Pending-header">
                  <div className="title">Pending</div>
                  <div className="addBtn">
                    <FontAwesomeIcon className='plusIcon' onClick={() => { showAddNewTask('Pending') }} icon={faPlusCircle} />
                  </div>
                </div>

                <div className="todo-body Pending-body">
                  <Droppable droppableId="Pending">
                    {(provider) => (
                      <div  {...provider.droppableProps} ref={provider.innerRef}>
                        {
                          data && data?.length > 0 && data.some(task => task.task_status === 'Pending') ? data?.sort((a, b) => a.task_id - b.task_id)?.map((i, index) => {

                            return i.task_status === 'Pending' && (<Draggable key={i.task_id} draggableId={String(i.task_id)} index={index}>
                              {(provider) => (<div key={i.task_id} className="todo-box p-3" ref={provider.innerRef} {...provider.draggableProps} {...provider.dragHandleProps} >
                                <div className="todo-box-header fw-bold d-flex justify-content-between">
                                  <div className="date">
                                    {moment(i?.task_date).format("YYYY-MM-DD h:mm A")}
                                  </div>
                                  <div className="todo-box-btns">
                                    <FontAwesomeIcon className='mx-1 todo-box-icons editIcon'
                                      onClick={() => {
                                        getTodoForUpdate(i.task_id)
                                        setCurrUpdateTaskData({
                                          task_id: i.task_id,
                                          task_status: i.task_status
                                        })
                                      }}
                                      icon={faPencil} />
                                    <FontAwesomeIcon className='mx-1 todo-box-icons deleteIcon' onClick={() => {
                                      handleDeleteShow()
                                      setCurrDeleteTaskData({
                                        task_id: i.task_id,
                                        task_status: i.task_status
                                      })
                                    }} icon={faTrash} />
                                  </div>
                                </div>
                                <hr className='hr' />
                                <div className="todo-box-title mt-3">
                                  {i.task_title}
                                </div>
                              </div>)}</Draggable>)
                          }).sort((a, b) => b.task_id - a.task_id) : <div className="mt-4 noData text-center h3  ">No Task Pending.</div>
                        }</div>)
                    }
                  </Droppable>

                </div>
              </Col>
              <Col lg={4}>
                <div className="header h3  InProgress-header">
                  <div className="title">In Progress</div>
                  <div className="addBtn">
                    <FontAwesomeIcon className='plusIcon' onClick={() => { showAddNewTask('In Progress') }} icon={faPlusCircle} />
                  </div>
                </div>

                <div className="todo-body InProgress-body">
                  <Droppable droppableId="In Progress">
                    {(provider) => (
                      <div  {...provider.droppableProps} ref={provider.innerRef}>
                        {
                          data && data?.length > 0 && data.some(task => task.task_status === 'In Progress') ? data?.sort((a, b) => a.task_id - b.task_id)?.map((i, index) => {

                            return i.task_status === 'In Progress' && (<Draggable key={i.task_id} draggableId={String(i.task_id)} index={index}>
                              {(provider) => (<div key={i.task_id} className="todo-box p-3" ref={provider.innerRef} {...provider.draggableProps} {...provider.dragHandleProps} >
                                <div className="todo-box-header fw-bold d-flex justify-content-between">
                                  <div className="date">
                                    {moment(i?.task_date).format("YYYY-MM-DD h:mm A")}
                                  </div>
                                  <div className="todo-box-btns">
                                    <FontAwesomeIcon className='mx-1 todo-box-icons editIcon'
                                      onClick={() => {
                                        getTodoForUpdate(i.task_id)
                                        setCurrUpdateTaskData({
                                          task_id: i.task_id,
                                          task_status: i.task_status
                                        })
                                      }}
                                      icon={faPencil} />
                                    <FontAwesomeIcon className='mx-1 todo-box-icons deleteIcon' onClick={() => {
                                      handleDeleteShow()
                                      setCurrDeleteTaskData({
                                        task_id: i.task_id,
                                        task_status: i.task_status
                                      })
                                    }} icon={faTrash} />
                                  </div>
                                </div>
                                <hr className='hr' />
                                <div className="todo-box-title mt-3">
                                  {i.task_title}
                                </div>
                              </div>)}</Draggable>)
                          }) : <div className="mt-4 noData text-center h3  ">No Task In Progress.</div>
                        }</div>)
                    }
                  </Droppable>
                </div>
              </Col>
              <Col lg={4}>
                <div className="header h3  InProgress-header">
                  <div className="title">Completed</div>
                  <div className="completeBtn">
                    <FontAwesomeIcon className='checkIcon' icon={faCircleCheck} />
                  </div>
                </div>
                <div className="todo-body Completed-body">
                  <Droppable droppableId="Completed">
                    {(provider) => (
                      <div  {...provider.droppableProps} ref={provider.innerRef}>
                        {
                          data && data?.length > 0 && data.some(task => task.task_status === 'Completed') ? data?.sort((a, b) => a.task_index - b.task_index)?.map((i, index) => {

                            return i.task_status === 'Completed' && (<Draggable key={i.task_id} draggableId={String(i.task_id)} index={i.task_index}>
                              {(provider) => (<div key={i.task_id} className="todo-box p-3" ref={provider.innerRef} {...provider.draggableProps} {...provider.dragHandleProps} >
                                <div className="todo-box-header fw-bold d-flex justify-content-between">
                                  <div className="date">
                                    {moment(i?.task_date).format("YYYY-MM-DD h:mm A")}
                                  </div>
                                  <div className="todo-box-btns">
                                    <FontAwesomeIcon className='mx-1 todo-box-icons editIcon'
                                      onClick={() => {
                                        getTodoForUpdate(i.task_id)
                                        setCurrUpdateTaskData({
                                          task_id: i.task_id,
                                          task_status: i.task_status
                                        })
                                      }}
                                      icon={faPencil} />
                                    <FontAwesomeIcon className='mx-1 todo-box-icons deleteIcon' onClick={() => {
                                      handleDeleteShow()
                                      setCurrDeleteTaskData({
                                        task_id: i.task_id,
                                        task_status: i.task_status
                                      })
                                    }} icon={faTrash} />
                                  </div>
                                </div>
                                <hr className='hr' />
                                <div className="todo-box-title mt-3">
                                  {i.task_title}
                                </div>
                              </div>)}</Draggable>)
                          }) : <div className="mt-4 noData text-center h3  ">No Task Completed.</div>
                        }</div>)
                    }
                  </Droppable>
                </div>
              </Col>
            </DragDropContext>
          </Row>
        </div>
      </Container>

      {/* //! ----------- Modals */}

      {/* //* ----------- Logout Modal */}
      <Modal show={logoutShow} onHide={handleLogoutClose}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Modnoal heading</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>Do you really want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogoutClose}>
            Cancel
          </Button>
          <Button variant="danger"
            onClick={() => {
              handleLogoutClose();
              localStorage.clear()
              navigate('/login')

            }}
          >
            Logout
          </Button>
        </Modal.Footer>
      </Modal>


      {/* //* ----------- Add New todo Modal */}
      <Modal show={addNewTaskShow} onHide={handleAddNewTaskClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New {newTaskStatus}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-5'>

          <FloatingLabel
            controlId="floatingTextarea"
            label={`${newTaskStatus} Task Title`}
            className="addTaskInput mb-3"
          >
            <Form.Control
              name='taskTitle'
              placeholder={`${newTaskStatus} Task Title`}
              onBlur={(e) => { updateAddDataValues(e) }}
              onChange={(e) => { updateAddDataValues(e) }}
            />
          </FloatingLabel>
          <FloatingLabel className='addTaskInput' controlId="floatingTextarea2" label={`${newTaskStatus} Task Description`}>
            <Form.Control
              as="textarea"
              name='taskDescription'
              placeholder={`${newTaskStatus} Task Description`}
              onBlur={(e) => { updateAddDataValues(e) }}
              onChange={(e) => { updateAddDataValues(e) }}
              style={{ height: '100px' }}
            />
          </FloatingLabel>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddNewTaskClose}>
            Cancel
          </Button>
          <Button variant="success"
            onClick={() => {
              addNewTask()
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>


      {/* //* ----------- Update todo Modal */}
      <Modal show={updateTaskShow} onHide={handleUpdateClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New {newTaskStatus}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='p-5'>

          <FloatingLabel
            controlId="floatingTextarea"
            label={`${newTaskStatus} Task Title`}
            className="updateTaskInput mb-3"
          >
            <Form.Control
              name='taskTitle'
              defaultValue={updateTodoData?.taskTitle}
              placeholder={`${newTaskStatus} Task Title`}
              onBlur={(e) => { updateAddDataValues(e) }}
              onChange={(e) => { updateAddDataValues(e) }}
            />
          </FloatingLabel>
          <FloatingLabel className='updateTaskInput' controlId="floatingTextarea2" label={`${newTaskStatus} Task Description`}>
            <Form.Control
              defaultValue={updateTodoData?.taskDescription}
              as="textarea"
              name='taskDescription'
              placeholder={`${newTaskStatus} Task Description`}
              onBlur={(e) => { updateAddDataValues(e) }}
              onChange={(e) => { updateAddDataValues(e) }}
              style={{ height: '100px' }}
            />
          </FloatingLabel>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUpdateClose}>
            Cancel
          </Button>
          <Button variant="success"
            onClick={() => {
              update_Task()
            }}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>


      {/* //* ----------- Delete Confirmation Modal */}
      <Modal show={deleteShow} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Modnoal heading</Modal.Title> */}
        </Modal.Header>
        <Modal.Body className='fw-bold h5'>Do you really want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button variant="danger"
            onClick={() => {
              delete_Task(currDeleteTaskData)
            }}
          >
            Yes, Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  )
}

export default Home



// CHECK CHATGPT

/*
// PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default PrivateRoute;
 */