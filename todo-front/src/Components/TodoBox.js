import React, { memo } from 'react'
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPencil, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment/moment';
import { Draggable, Droppable } from 'react-beautiful-dnd';


function TodoBox({ data, currStatus, todoBodyClass, showAddNewTask, getTodoById, handleUpdateShow, setCurrUpdateTaskData, handleDeleteShow, setCurrDeleteTaskData, handleViewTaskShow }) {
    return (
        <Col lg={4}>
            <div className="header h3  Pending-header">
                <div className="title">{currStatus}</div>
                {
                    currStatus !== "Completed"
                        ?
                        <div className="addBtn">
                            <FontAwesomeIcon className='plusIcon' onClick={() => { showAddNewTask(currStatus) }} icon={faPlusCircle} />
                        </div>
                        :
                        <div className="completeBtn">
                            <FontAwesomeIcon className='checkIcon' icon={faCircleCheck} />
                        </div>
                }
            </div>

            <Droppable droppableId={currStatus}>
                {(provider) => (
                    <div  {...provider.droppableProps} ref={provider.innerRef}>
                        <div className={`todo-body ${todoBodyClass}`}>
                            {
                                // data && data?.length > 0 && data.some(task => task.task_status === 'Pending') ?
                                data && data?.length > 0 && data.some(task => task.task_status === currStatus) ?

                                    // data?.sort((a, b) => a.task_index - b.task_index)?.filter(e => e.task_status === 'Pending').map((i, index) => {
                                    data?.sort((a, b) => a.task_index - b.task_index)?.filter(e => e.task_status === currStatus).map((i, index) => {

                                        // return i.task_status === 'Pending' && (<Draggable key={i.task_id} draggableId={String(i.task_id)} index={index}>
                                        return i.task_status === currStatus && (<Draggable key={i.task_id} draggableId={String(i.task_id)} index={index}>
                                            {(provider) => (<div key={i.task_id} className="todo-box p-3" ref={provider.innerRef} {...provider.draggableProps} {...provider.dragHandleProps} >
                                                <div className="todo-box-header fw-bold d-flex justify-content-between">
                                                    <div className="date">
                                                        {moment(i?.task_date).format("YYYY-MM-DD h:mm A")}
                                                    </div>
                                                    <div className="todo-box-btns">
                                                        <FontAwesomeIcon className='mx-1 todo-box-icons editIcon'
                                                            onClick={() => {
                                                                getTodoById(i.task_id)
                                                                handleUpdateShow()
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
                                                <div className={` ${currStatus === 'Completed' && "text-decoration-line-through"} todo-box-title mt-3`} onClick={() => {
                                                    handleViewTaskShow()
                                                    getTodoById(i.task_id)
                                                }}>

                                                    {i.task_title}
                                                </div>
                                            </div>)}</Draggable>)
                                    }).sort((a, b) => b.task_id - a.task_id) : <div className="mt-4 noData text-center h3  ">No Task {currStatus}.</div>
                            }
                        </div>
                    </div>)
                }
            </Droppable>

        </Col>
    )
}

export default memo(TodoBox)
// export default TodoBox