import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getContacts, clearContacts } from './redux/actions';
import { useLocation, useNavigate } from 'react-router-dom';

const ContactModal = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchText, setSearchText] = useState('');
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [contactDetails, setContactDetails] = useState(null);
    const [isEvenContacts, setIsEvenContacts] = useState(false);
    const dispatch = useDispatch();

    const data = useSelector(state => state);
    const filterSelector = createSelector(
        state => state.Contacts?.contacts_ids,
        items => items?.map((item) => {
            if (isEvenContacts) {
                if (item % 2 === 0) {
                    return item;
                }
                return null;
            } else {
                return item;
            }
        }).filter((val) => val !== null)
    );
    const filterIds = filterSelector(data);

    useEffect(() => {
        console.log("Ye data h bhai , ", data)
    }, [data]);

    useEffect(() => {
        const getInitialData = () => {
            if (location.state === 'Modal A') {
                // dispatch(getContacts({ page: 1, companyId: 171 }));
            } else {
                dispatch(getContacts({ page: 1, companyId: 171, countryId: 226 }));
            }
        }
        getInitialData();
    }, [dispatch, location.state]);

    useEffect(() => {
        console.log("location.state : ", location.state)
    }, [])

    const handleAboutToReachBottom = () => {
        if (data.Contacts && !data.APICallPagination && data.Contacts.total !== 0 && !(Math.ceil(data.Contacts.total / 20) === data.Contacts.page)) {
            let params = {
                page: data.Contacts.page + 1,
                companyId: 171,
                query: searchText
            }
            if (location.state === 'Modal B') {
                params.countryId = 226
            }
            dispatch(getContacts(params, true));
        }
    }

    const handleUpdate = (values) => {
        const { scrollTop, scrollHeight, clientHeight } = values;
        const pad = 1;
        const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
        if (t > 1) handleAboutToReachBottom();
    }

    const onSearchTextChange = (text) => {
        setSearchText(text);
        setTimeout(() => {
            if (!data.APICall) {
                dispatch(clearContacts());
                if (location.state === 'Modal A') {
                    dispatch(getContacts({ page: 1, companyId: 171, query: text }));
                } else {
                    dispatch(getContacts({ page: 1, companyId: 171, countryId: 226, query: text }));
                }
            }
        }, 500);
    }

    const onSearchClick = () => {
        if (!data.APICall) {
            dispatch(clearContacts());
            if (location.state === 'Modal A') {
                dispatch(getContacts({ page: 1, companyId: 171, query: searchText }));
            } else {
                dispatch(getContacts({ page: 1, companyId: 171, countryId: 226, query: searchText }));
            }
        }
    }
    const isModelA = () => location.state === "Modal A"

    const getColor = () => isModelA() ? "#46139f" : "#ff7f50"

    // return (
    //     <>
    //     <h1>Helol</h1>
    //     </>
    // )

    return (
        <Modal isOpen size='xl'>
            <ModalHeader toggle={() => {
                dispatch(clearContacts());
                navigate('/');
            }}>
                {location.state}
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col sm='12' md='4' className='d-flex justify-content-center'>
                        <Button className='btn btn-a' style={{
                            background: getColor()
                        }} onClick={() => {
                            if (location.state === 'Modal B') {
                                dispatch(clearContacts());
                                navigate('/modalA',{
                                    state: 'Modal A'
                                  });
                            }
                        }}>All Contacts</Button>
                    </Col>
                    <Col sm='12' md='4' className='d-flex justify-content-center'>
                        <Button className='btn btn-b' style={{
                            background: getColor()
                        }} onClick={() => {
                            if (location.state === 'Modal A') {
                                dispatch(clearContacts());
                                navigate('/modalB',{
                                    state: 'Modal B'
                                  });
                            }
                        }}>US Contacts</Button>
                    </Col>
                    <Col sm='12' md='4' className='d-flex justify-content-center'>
                        <Button className='btn btn-c border-2' style={{
                            background: "#46139f"
                        }} onClick={() => {
                            dispatch(clearContacts());
                            navigate('/');
                        }}>Close</Button>
                    </Col>
                </Row>
                <Row className='mt-2'>
                    <Col sm='12' md='11'>
                        <Input type='text' className='border-2 rounded' placeholder='Search Contacts...'
                            onChange={(event) => {
                                onSearchTextChange(event.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                    onSearchClick();
                                }
                            }} />
                    </Col>
                    <Col sm='12' md='1'>
                        <Button onClick={onSearchClick}>Search</Button>
                    </Col>
                </Row>
                <Scrollbars className='mt-3' autoHeight autoHeightMin={400} onUpdate={(values) => {
                    // console.log("Update ho raha hu bhai ")
                    handleUpdate(values)
                }}>
                    {
                        data.APICall ?
                            <div className='w-100 d-flex align-items-center justify-content-center'>
                                <Spinner />
                                {/* <h1>Hello</h1> */}
                            </div>
                            :
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Country</th>
                                        <th>Phone Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !data.Contacts?.total ?
                                            <tr >
                                                <td colSpan={5} style={{ textAlign: 'center' }}>{"No data found, please try again"}</td>
                                            </tr>
                                            : filterIds?.map((item, index) => {
                                                return (
                                                    <tr key={item} onClick={() => {
                                                        setContactDetails(data.Contacts.contacts[item]);
                                                        setIsDetailModalVisible(!isDetailModalVisible);
                                                    }}>
                                                        <td>{item}</td>
                                                        <td>{data.Contacts.contacts[item].first_name}</td>
                                                        <td>{data.Contacts.contacts[item].last_name}</td>
                                                        <td>{data.Contacts.contacts[item].country.iso}</td>
                                                        <td>{data.Contacts.contacts[item].phone_number}</td>
                                                    </tr>
                                                )
                                            })
                                    }
                                    {
                                        data.APICallPagination &&
                                        <tr>
                                            <td colSpan={5} className='text-center'>
                                                <Spinner />
                                                {/* <h1>Hello 3d</h1> */}

                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                    }
                </Scrollbars>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-start ml-5'>
                <Label check>
                    <Input type="checkbox" value={isEvenContacts} onChange={() => setIsEvenContacts(!isEvenContacts)} />{' '}
                    Only even
                </Label>
            </ModalFooter>
            {/* Detail modal */}
            <Modal isOpen={isDetailModalVisible}>
                <ModalHeader toggle={() => {
                    setContactDetails(null);
                    setIsDetailModalVisible(!isDetailModalVisible);
                }}>
                    Modal C
                </ModalHeader>
                <ModalBody>
                    {
                        contactDetails &&
                        <ul>
                            <li>{contactDetails.first_name}</li>
                            <li>{contactDetails.last_name}</li>
                            <li>{contactDetails.country.iso}</li>
                            <li>{contactDetails.phone_number}</li>
                        </ul>
                    }
                </ModalBody>
            </Modal>
        </Modal >
    )
}

export default ContactModal;