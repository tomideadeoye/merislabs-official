import React from 'react';
import { Meta, Story } from '@storybook/react';
import { MorganHacksSponsorshipPacket } from './MorganHacksSponsorshipPacket';

export default {
    title: 'Components/MorganHacks/SponsorshipPacket',
    component: MorganHacksSponsorshipPacket,
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: Story = (args) => <MorganHacksSponsorshipPacket {...args} />;

export const Default = Template.bind({});
Default.args = {};
