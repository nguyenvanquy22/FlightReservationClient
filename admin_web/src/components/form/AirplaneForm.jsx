import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './styles/AirplaneForm.scss';
import { fetchWithToken } from '../../views/fetchWithToken';
import config from '../../views/config.json';

const { SERVER_API } = config;

const AirplaneForm = ({ currentAirplane, onSubmit, onCancel, errorMessage }) => {
    const [airlines, setAirlines] = useState([]);
    const [seatClasses, setSeatClasses] = useState([]);
    const [seatClassOptions, setSeatClassOptions] = useState([]);
    const [selectedSeatClasses, setSelectedSeatClasses] = useState([]);
    const [seatClassConfigs, setSeatClassConfigs] = useState({});

    // 1. Fetch airlines
    const fetchAirlines = async () => {
        try {
            const res = await fetchWithToken(`${SERVER_API}/airlines`);
            const json = await res.json();
            setAirlines(json.data);
        } catch (err) {
            console.error(err);
        }
    };

    // 2. Fetch seat-classes
    const fetchSeatClasses = async () => {
        try {
            const res = await fetchWithToken(`${SERVER_API}/seat-classes`);
            const json = await res.json();
            const scs = json.data;
            setSeatClasses(scs);

            // build options for react-select
            const opts = scs.map(sc => ({ value: sc.id, label: sc.name }));
            setSeatClassOptions(opts);

            // initialize configs & default selection if editing
            const cfgs = {};
            const preSelected = [];

            scs.forEach(sc => {
                // find existing config
                const existing = currentAirplane?.seatClassAirplanes?.find(x => x.seatClassId === sc.id);
                if (existing) {
                    cfgs[sc.id] = {
                        seatClassId: sc.id,
                        rowCount: existing.rowCount.toString(),
                        columnCount: existing.columnCount.toString(),
                    };
                    preSelected.push({ value: sc.id, label: sc.name });
                } else {
                    cfgs[sc.id] = { seatClassId: sc.id, rowCount: '', columnCount: '' };
                }
            });

            setSeatClassConfigs(cfgs);
            setSelectedSeatClasses(preSelected);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAirlines();
        fetchSeatClasses();
        // eslint-disable-next-line
    }, []);

    const handleSelectChange = options => {
        setSelectedSeatClasses(options || []);
    };

    const handleSeatClassChange = (id, field, val) => {
        setSeatClassConfigs(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: val
            }
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        const form = e.target;

        const airplaneData = {
            model: form.model.value,
            registrationCode: form.registrationCode.value,
            airlineId: parseInt(form.airlineId.value, 10),
            status: form.status.value,
            seatClassConfigs: selectedSeatClasses.map(opt => {
                const cfg = seatClassConfigs[opt.value];
                return {
                    seatClassId: opt.value,
                    rowCount: parseInt(cfg.rowCount, 10),
                    columnCount: parseInt(cfg.columnCount, 10),
                };
            })
        };
        onSubmit(airplaneData);
    };

    return (
        <div className="aircraft-form-container">
            <h3>{currentAirplane ? 'Edit Airplane' : 'Add Airplane'}</h3>
            <form onSubmit={handleSubmit} className="form-grid">
                {/* ==== COLUMN 1: BASIC INFO ==== */}
                <div className="basic-info">
                    <label>
                        Airplane Model
                        <input name="model" type="text" defaultValue={currentAirplane?.model || ''} required />
                        {errorMessage?.model && <span className="error">{errorMessage.model}</span>}
                    </label>

                    <label>
                        Registration Code
                        <input
                            name="registrationCode"
                            type="text"
                            defaultValue={currentAirplane?.registrationCode || ''}
                            required
                        />
                        {errorMessage?.registrationCode && (
                            <span className="error">{errorMessage.registrationCode}</span>
                        )}
                    </label>

                    <label>
                        Airline
                        <select name="airlineId" defaultValue={currentAirplane?.id || ''} required>
                            <option value="" disabled>
                                -- Select Airline --
                            </option>
                            {airlines.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                        {errorMessage?.airlineId && <span className="error">{errorMessage.airlineId}</span>}
                    </label>

                    <label>
                        Status
                        <select name="status" defaultValue={currentAirplane?.status || 'ACTIVE'} required>
                            <option value="ACTIVE">Active</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>
                        {errorMessage?.status && <span className="error">{errorMessage.status}</span>}
                    </label>
                </div>

                {/* ==== COLUMN 2: SEAT CLASS CONFIG ==== */}
                <div className="seat-config-info">
                    <label>
                        <p>Seat Classes</p>
                        <Select
                            options={seatClassOptions}
                            value={selectedSeatClasses}
                            onChange={handleSelectChange}
                            isMulti
                            placeholder="Search & select seat classes..."
                        />
                    </label>

                    <div className="seat-config-list">
                        {selectedSeatClasses.map(opt => {
                            const id = opt.value;
                            const name = opt.label;
                            const cfg = seatClassConfigs[id] || {};
                            return (
                                <div key={id} className="seat-class-config">
                                    <h5>{name}</h5>
                                    <label>
                                        Row Count
                                        <input
                                            type="number"
                                            value={cfg.rowCount}
                                            onChange={e => handleSeatClassChange(id, 'rowCount', e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Column Count
                                        <input
                                            type="number"
                                            value={cfg.columnCount}
                                            onChange={e => handleSeatClassChange(id, 'columnCount', e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Seat Quantity
                                        <input
                                            type="number"
                                            value={cfg.rowCount * cfg.columnCount}
                                            disabled
                                        />
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ==== FULL-WIDTH BUTTONS ==== */}
                <div className="button-group full-width">
                    <button type="button" className="cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-button">
                        {currentAirplane ? 'Save Changes' : 'Add Airplane'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AirplaneForm;
