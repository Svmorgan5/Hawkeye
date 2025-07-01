import '../../components/Dashboard/Dashboard.css'
import '../Alerts/Alerts.css'
import DashCard from '../Dashboard/DashCard';
import Alert from '../../assets/Alert.png'
const Alerts = () => {
  return (
    <div>
    <div className="alert-cards">
     <div><DashCard  heading='Shared Alerts' message='View all shared alerts. ' picture={Alert} link='/alerts'/></div>
      <div> <DashCard  heading='Alerts' message='View all recent alerts.' picture={Alert} link='/alerts'/></div>
       



    </div>
    <table className='alerts-table'>
      <thead className='alerts-table-head'>
        <th> 
          <input  
            type="checkbox"></input>
         </th>
        <th> Code </th>
         <th> Date/Time </th>
          <th> Location </th>
           <th> Table Header </th>
            <th> Create Report </th>
        
      </thead>
    </table>
    </div>
    
  );
};

export default Alerts;


// #Place holder for alert CRUD

// from flask import Blueprint, request, jsonify
// from backend.application.models import db, Alert, Camera, AlertType
// from marshmallow import ValidationError
// from sqlalchemy import select
// from datetime import datetime
// from backend.application.blueprints.alert.alertSchemas import alert_schema, alerts_schema
// from . import alerts_bp

// #Do we want token authentication for this CRUD?


// # Create Alert
// @alerts_bp.route('/', methods=['POST'])
// def create_alert():
//     try:
//         alert_data = alert_schema.load(request.json)
//     except ValidationError as e:
//         return jsonify(e.messages), 400

//     camera_ids = request.json.get('camera_ids', [])
//     cameras = db.session.query(Camera).filter(Camera.id.in_(camera_ids)).all() if camera_ids else []

//     new_alert = alert_data
//     new_alert.cameras = cameras

//     db.session.add(new_alert)
//     db.session.commit()

//     from backend.application import socketio
//     socketio.emit('new_alert', {
//         'id': new_alert.id,
//         'message': new_alert.message,
//         'code': new_alert.code,
//         'location': new_alert.location,
//         'alert_type': new_alert.alert_type.value,
//         'timestamp': new_alert.timestamp.isoformat(),
//     })

//     return alert_schema.jsonify(new_alert), 201


// @alerts_bp.route('/', methods=['GET'])
// def get_alerts():
//     alerts = db.session.query(Alert).all()
//     return alerts_schema.jsonify(alerts), 200

// # Get single alert
// @alerts_bp.route('/<int:alert_id>', methods=['GET'])
// def get_alert(alert_id):
//     alert = db.session.get(Alert, alert_id)
//     if not alert:
//         return jsonify({"error": "Alert not found"}), 404
//     return alert_schema.jsonify(alert), 200

// # Update alert
// @alerts_bp.route('/<int:alert_id>', methods=['PUT'])
// def update_alert(alert_id):
//     alert = db.session.get(Alert, alert_id)
//     if not alert:
//         return jsonify({"error": "Alert not found"}), 404
//     try:
//         # This returns an Alert instance with updated fields
//         updated_alert = alert_schema.load(request.json, session=db.session, instance=alert, partial=True)
//     except ValidationError as e:
//         return jsonify(e.messages), 400

//     db.session.commit()
//     return alert_schema.jsonify(updated_alert), 200

// # Delete alert
// @alerts_bp.route('/<int:alert_id>', methods=['DELETE'])
// def delete_alert(alert_id):
//     alert = db.session.get(Alert, alert_id)
//     if not alert:
//         return jsonify({"error": "Alert not found"}), 404
//     db.session.delete(alert)
//     db.session.commit()
//     return jsonify({"message": "Alert deleted successfully."}), 200