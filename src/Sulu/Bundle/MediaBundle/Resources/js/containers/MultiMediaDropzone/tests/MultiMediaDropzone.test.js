// @flow
import React from 'react';
import {observable} from 'mobx';
import {mount, render, shallow} from 'enzyme';
import Mousetrap from 'mousetrap';
import MultiMediaDropzone from '../MultiMediaDropzone';
import MediaUploadStore from '../../../stores/MediaUploadStore';

jest.useFakeTimers();

jest.mock('sulu-admin-bundle/utils', () => ({
    translate(key) {
        switch (key) {
            case 'sulu_media.drop_files_to_upload':
                return 'Upload files by dropping them here';
            case 'sulu_media.click_here_to_upload':
                return 'or click here to upload';
        }
    },
}));

jest.mock('../../../stores/MediaUploadStore', () => jest.fn(function() {
    this.create = jest.fn((_, file) => {
        if (file.name === 'invalid-file') {
            return Promise.reject('error-while-uploading-file');
        }

        return Promise.resolve({
            id: 123,
        });
    });
    this.progress = 45;
    this.getThumbnail = jest.fn((size) => {
        switch (size) {
            case 'sulu-400x-inset':
                return 'http://lorempixel.com/400/250';
        }
    });
}));

test('Render a MultiMediaDropzone', () => {
    expect(render(
        <MultiMediaDropzone
            collectionId={3}
            locale={observable.box()}
            onClose={jest.fn()}
            onOpen={jest.fn()}
            onUpload={jest.fn()}
            onUploadError={jest.fn()}
            open={false}
        >
            <div />
        </MultiMediaDropzone>
    )).toMatchSnapshot();
});

test('Render the DropzoneOverlay while the overlay is visible', () => {
    const multiMediaDropzone = mount(
        <MultiMediaDropzone
            collectionId={3}
            locale={observable.box()}
            onClose={jest.fn()}
            onOpen={jest.fn()}
            onUpload={jest.fn()}
            onUploadError={jest.fn()}
            open={true}
        >
            <div />
        </MultiMediaDropzone>
    );

    multiMediaDropzone.update();

    expect(multiMediaDropzone.find('DropzoneOverlay')).toHaveLength(1);
});

test('Show media while it is being uploaded', () => {
    const locale = observable.box('en');
    const uploadSpy = jest.fn();
    const multiMediaDropzone = mount(
        <MultiMediaDropzone
            collectionId={3}
            locale={locale}
            onClose={jest.fn()}
            onOpen={jest.fn()}
            onUpload={uploadSpy}
            onUploadError={jest.fn()}
            open={true}
        >
            <div />
        </MultiMediaDropzone>
    );
    const files = [
        new File([''], 'fileA'),
        new File([''], 'fileB'),
    ];

    multiMediaDropzone.instance().handleDrop(files);
    multiMediaDropzone.update();

    expect(multiMediaDropzone.find('MediaItem')).toHaveLength(2);
});

test('Should upload media when it is dropped on the dropzone', () => {
    const locale = observable.box('en');
    const uploadSpy = jest.fn();
    const closeSpy = jest.fn();

    const multiMediaDropzone = shallow(
        <MultiMediaDropzone
            collectionId={3}
            locale={locale}
            onClose={closeSpy}
            onOpen={jest.fn()}
            onUpload={uploadSpy}
            onUploadError={jest.fn()}
            open={true}
        >
            <div />
        </MultiMediaDropzone>
    );
    const multiMediaDropzoneInstance = multiMediaDropzone.instance();
    const files = [
        new File([''], 'fileA'),
        new File([''], 'fileB'),
    ];

    const dropPromise = multiMediaDropzoneInstance.handleDrop(files);

    // $FlowFixMe
    const mediaUploadStore1 = MediaUploadStore.mock.instances[0];
    // $FlowFixMe
    const mediaUploadStore2 = MediaUploadStore.mock.instances[1];

    expect(mediaUploadStore1.create).toBeCalledWith(3, files[0]);
    expect(mediaUploadStore2.create).toBeCalledWith(3, files[1]);
    expect(multiMediaDropzoneInstance.mediaUploadStores.length).toBe(2);

    expect(closeSpy).not.toBeCalled();

    return dropPromise.then(() => {
        jest.runAllTimers();

        expect(uploadSpy).toBeCalledWith([
            {id: 123},
            {id: 123},
        ]);
        expect(multiMediaDropzoneInstance.mediaUploadStores.length).toBe(0);
        expect(closeSpy).toBeCalledWith();
    });
});

test('Should fire onClose and onUploadError callback if an error happens when uploading media', () => {
    const locale = observable.box('en');
    const uploadErrorSpy = jest.fn();
    const closeSpy = jest.fn();

    const multiMediaDropzone = shallow(
        <MultiMediaDropzone
            collectionId={3}
            locale={locale}
            onClose={closeSpy}
            onOpen={jest.fn()}
            onUpload={jest.fn()}
            onUploadError={uploadErrorSpy}
            open={true}
        >
            <div />
        </MultiMediaDropzone>
    );

    const dropPromise = multiMediaDropzone.find('Dropzone').props().onDrop([
        new File([''], 'fileA'),
        new File([''], 'invalid-file'),
    ]);

    expect(closeSpy).not.toBeCalled();

    return dropPromise.then(() => {
        jest.runAllTimers();

        expect(closeSpy).toBeCalledWith();
        expect(multiMediaDropzone.instance().mediaUploadStores.length).toBe(0);
        expect(uploadErrorSpy).toBeCalledWith(['error-while-uploading-file']);
    });
});

test('Should close overlay when escape button is pressed', () => {
    const locale = observable.box('en');
    const closeSpy = jest.fn();

    mount(
        <MultiMediaDropzone
            collectionId={3}
            locale={locale}
            onClose={closeSpy}
            onOpen={jest.fn()}
            onUpload={jest.fn()}
            onUploadError={jest.fn()}
            open={true}
        >
            <div />
        </MultiMediaDropzone>
    );

    expect(closeSpy).not.toBeCalled();
    Mousetrap.trigger('esc');
    expect(closeSpy).toBeCalledWith();
});
