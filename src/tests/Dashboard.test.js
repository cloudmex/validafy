
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Dash from '../views/Dashboard'


Storage.prototype.setItem = jest.fn();

describe('Pruevas en el Dashboard', () => {
    test('Deveria de validar el documento a traves de todas las redes disponibles', () => {
        
        const comp = mount(
            <MemoryRouter>
                <Dash/>
            </MemoryRouter>
        );
        console.log(comp.html().trim());
        // expect();
    })
    
})
