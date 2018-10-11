import React from 'react';
import 'jest-styled-components';
import renderer from 'react-test-renderer';
import { cleanup, fireEvent, render, renderIntoDocument, Simulate } from 'react-testing-library';

import { createPortal, expectPortal } from '../../../utils/portal';

import { DropButton } from '../';

describe('DropButton', () => {
  beforeEach(createPortal);

  afterEach(cleanup);

  test('closed', () => {
    const component = renderer.create(
      <DropButton
        label='Dropper'
        dropContent={<div id='drop-contents'>drop contents</div>}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('opened', () => {
    const component = renderer.create(
      <DropButton
        label='Dropper'
        open={true}
        dropContent={<div id='drop-contents'>drop contents</div>}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('open and close', () => {
    window.scrollTo = jest.fn();
    const { getByText, container } = render(
      <DropButton
        label='Dropper'
        dropContent={<div id='drop-contents'>Drop Contents</div>}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(document.getElementById('drop-contents')).toBeNull();

    Simulate.click(getByText('Dropper'));
    expectPortal('drop-contents').toMatchSnapshot();

    Simulate.click(getByText('Dropper'));
    expect(document.getElementById('drop-contents')).toBeNull();
    expect(window.scrollTo).toBeCalled();
  });

  test('close by clicking outside', (done) => {
    const { getByText, container } = renderIntoDocument(
      <DropButton
        label='Dropper'
        dropContent={<div id='drop-contents'>Drop Contents</div>}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(document.getElementById('drop-contents')).toBeNull();

    Simulate.click(getByText('Dropper'));
    expectPortal('drop-contents').toMatchSnapshot();

    fireEvent(document, new MouseEvent('mousedown', { bubbles: true, cancelable: true }));

    setTimeout(() => {
      expect(document.getElementById('drop-contents')).toBeNull();
      done();
    }, 50);
  });

  test('disabled', () => {
    const { getByText, container } = render(
      <DropButton
        disabled={true}
        label='Dropper'
        dropContent={<div id='drop-contents'>Drop Contents</div>}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(document.getElementById('drop-contents')).toBeNull();

    Simulate.click(getByText('Dropper'));
    expect(document.getElementById('drop-contents')).toBeNull();
  });

  test('opened ref', () => {
    const ref = React.createRef();
    const { container } = render(
      <DropButton
        ref={ref}
        open={true}
        label='Dropper'
        dropContent={<div id='drop-contents'>Drop Contents</div>}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
    expectPortal('drop-contents').toMatchSnapshot();
  });
});