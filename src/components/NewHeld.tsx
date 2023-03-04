import React, { useRef, useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Held } from './Held';
import { IHeld } from '../store/held';

interface INewHeldProps {
    held?: IHeld;
    onChange: (held: IHeld) => void;
}

export const NewHeld: React.FC<INewHeldProps> = (props) => {
    const dataHandler = (data: string): string => {
        const parser = new XMLParser({
            ignoreAttributes: false
        });
        const result = XMLValidator.validate(data, {
            allowBooleanAttributes: true
        });
        if (result === true) {
            const held = parser.parse(data);
            props.onChange(held.helden.held);
            return '';
        } else {
            return result.err.msg;
        }
    };
    return (
        <Container>
            <FileUpload
                name="held-upload"
                label="Held hochladen"
                description="Lade ein XML file der helden software hier hoch."
                dataHandler={dataHandler}
            />
            {props.held && <Held className="mt-3" held={props.held} />}
        </Container>
    );
};

interface IFileUploadProps {
    label: string;
    name: string;
    description: string;
    dataHandler: (data: string) => string;
    is_optional?: boolean;
    className?: string;
}

const FileUpload: React.FC<IFileUploadProps> = (props) => {
    enum UploadState {
        NoFile = 0,
        Uploading,
        UploadSuccess,
        UploadFail
    }
    const ref = useRef<HTMLInputElement>(null);
    const [upload_state, setUploadState] = useState(UploadState.NoFile);
    const [upload_error, setUploadError] = useState('');
    const fileReader = new FileReader();

    useEffect(() => {
        setUploadState(UploadState.NoFile);
        setUploadError('');
        if (ref.current) {
            ref.current.value = '';
        }
    }, [UploadState.NoFile]);

    fileReader.onload = (event: any) => {
        if (event && event.target && event.target.result) {
            const error = props.dataHandler(event.target.result);
            if (error !== '') {
                setUploadState(UploadState.UploadFail);
                setUploadError(error);
            } else {
                setUploadState(UploadState.UploadSuccess);
                setUploadError('');
            }
        }
    };
    const onUpload = (event: any) => {
        setUploadState(UploadState.Uploading);
        const file = event.target.files[0];
        fileReader.readAsText(file);
    };
    const renderUploadIcon = () => {
        switch (upload_state) {
            case UploadState.Uploading:
                return <FontAwesomeIcon icon="spinner" spin={true} />;
            case UploadState.UploadFail:
                return (
                    <FontAwesomeIcon
                        title={upload_error}
                        className="text-danger"
                        icon="exclamation-triangle"
                    />
                );
            case UploadState.UploadSuccess:
                return (
                    <FontAwesomeIcon className="text-success" icon="check" />
                );
        }
    };
    return (
        <Form.Group className={props.className}>
            <Form.Label>
                <strong>{props.label}</strong>
                {props.is_optional && <i> - optional</i>}
            </Form.Label>
            <span className="ms-2">{renderUploadIcon()}</span>
            <Form.Control
                ref={ref}
                name={props.name}
                type="file"
                required={!props.is_optional}
                onChange={onUpload}
            />
            <Form.Text>{props.description}</Form.Text>
        </Form.Group>
    );
};
