import React from 'react'

import { useSelector } from 'react-redux'

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"

export default function ObservationHeader(props) {

    const observationData =  useSelector(state=>state.observationData.data)

    const { author, created, modified, description} = observationData


     return (
        <Row >
            <Card>
                <Card.Body>
                    <Row>
                        <Col>
                            { author ? <img className="avatar" src={author.profilePicLink} alt="" /> : <i className="fas fa-atom fa=2x"/> }
                        </Col>
                        <Col>
                            <a className="col">{author && author.username}</a>
                        </Col>
                        <Col>
                        <p className="col-auto" > Created: {created}</p>

                        {created !== modified && 
                        <p className="col-auto" >Updated: {modified}</p>
                        }
                    </Col>
                    <p style={{textAlign:"center"}}> {description } </p>
                    </Row>
                </Card.Body>
            </Card>
        </Row>
    )
}


