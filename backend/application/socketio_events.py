from backend.application import socketio
from flask_socketio import join_room, emit, leave_room
from flask import request

@socketio.on('join_room')
def handle_join_room(data):
    if isinstance(data, dict):
        room = data.get('room')
    else:
        room = data
    if not room:
        emit('error', {'message': 'Room name required'})
        return
    join_room(room)
    print(f"🔗 {request.sid} joined room: {room}")
    emit('joined_room', {'room': room}, room=room)

@socketio.on('leave_room')
def handle_leave_room(data):
    room = data.get('room') if isinstance(data, dict) else data
    if not room:
        emit('error', {'message': 'Room name required'})
        return
    leave_room(room)
    print(f"🚪 {request.sid} left room: {room}")
    emit('left_room', {'room': room}, room=room)

@socketio.on('send_message')
def handle_send_message(data):
    room = data.get('room')
    message = data.get('message')
    if not room or not message:
        emit('error', {'message': 'Room and message required'})
        return
    print(f"💬 Message to {room}: {message}")
    emit('receive_message', {'message': message, 'room': room}, room=room)

@socketio.on('disconnect')
def handle_disconnect():
    print(f"❌ Client disconnected: {request.sid}")

@socketio.on('ping')
def handle_ping():
    emit('pong')

@socketio.on('member_updated')
def handle_member_updated(data):
    room = data.get('room')
    member_id = data.get('member_id')
    if room and member_id:
        emit('member_update', {'member_id': member_id}, room=room)