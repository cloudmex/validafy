import '@testing-library/jest-dom';
import React from 'react';
import {openDDropdownPopover} from  '../components/Dropdown';
import {closeDropdownPopover} from '../components/Dropdown';
import {changeNet} from '../components/Dropdown';
import {
  addNetwork,
  isDeployed,
  getNetworkName,
  sameNetwork,
  wait,
} from "../utils/interaction_blockchain";


describe('Unitarias Dropdown', () => {
  test('abrir drop', () => {
    
    const ver = openDDropdownPopover();

    createPopper(btnDropdownRef.current, 
      popoverDropdownRef.current, {
      placement: "top-end",
    });
    etDropdownPopoverShow(true);

    expect(ver).toBeCalled(true);


    test('Cerrar drop', () => {
      const cerrar = closeDropdownPopover();
      setDropdownPopoverShow(false);
      expect(cerrar).toBeCalled();
      


    })
    
    test('should ', () => {
  




    } )


  })
  
})
