import React from 'react'
import { BarTooltipProps } from '@nivo/bar'
import { BasicTooltip } from '@nivo/tooltip'

/**
 * Unused test tooltip component for the Nivo barchart .
 * 
 * @returns {ReactElement} The rendered component.
 */
export const BarTooltip = <RawDatum,>({ color, label, ...data }: BarTooltipProps<RawDatum>) => {
    return <BasicTooltip id={label} value={parseFloat(data.formattedValue).toFixed(3)} enableChip={true} color={color} />
}