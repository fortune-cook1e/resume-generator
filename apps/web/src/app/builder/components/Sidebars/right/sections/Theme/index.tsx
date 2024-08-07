import SectionBase from '@/app/builder/components/Sidebars/right/common/SectionBase';
import { useResumeStore } from '@/store/resume';
import { FormEvent } from 'react';
import { Label, Input, cn, Popover, PopoverContent, PopoverTrigger } from 'ui';
import { HexColorPicker } from 'react-colorful';

const Palettes = [
  '#9253a1',
  '#f063a4',
  '#fcee21',
  '#f16154',
  '#76327e',
  '#1890ff',
  '#a42963',
  '#0b6a88',
  '#f89e4f',
  '#ec015a',
];

const Theme = () => {
  const theme = useResumeStore((state) => state.resume.data.metadata.theme);
  const setValue = useResumeStore((state) => state.setValue);

  const onPaletteClick = (color: string) => {
    setValue('metadata.theme.primaryColor', color);
  };

  const onPrimaryColorChange = (e: FormEvent<HTMLInputElement>) => {
    setValue('metadata.theme.primaryColor', e.currentTarget.value);
  };

  const onTextColorChange = (e: FormEvent<HTMLInputElement>) => {
    setValue('metadata.theme.textColor', e.currentTarget.value);
  };

  const onbgColorChange = (e: FormEvent<HTMLInputElement>) => {
    setValue('metadata.theme.backgroundColor', e.currentTarget.value);
  };

  const onCustomColorChange = (color: string) => {
    setValue('metadata.theme.primaryColor', color);
  };

  return (
    <SectionBase id="theme">
      <div className="mb-4 grid grid-cols-5 gap-4">
        {Palettes.slice(1).map((item) => {
          return (
            <div
              className="h-10 w-10 cursor-pointer rounded-md"
              style={{ background: item }}
              key={item}
              onClick={() => onPaletteClick(item)}
            />
          );
        })}

        <Popover>
          <PopoverTrigger asChild>
            <div className="flex h-10 w-10 cursor-pointer flex-wrap rounded-md">
              {Palettes.slice(1).map((item, index) => (
                <div
                  className={cn(
                    'h-1/3 w-1/3',
                    index === 0 && 'rounded-tl-md',
                    index === 2 && 'rounded-tr-md',
                    index === 6 && 'rounded-bl-md',
                    index === 8 && 'rounded-br-md',
                  )}
                  style={{ background: item }}
                  key={item}
                />
              ))}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <HexColorPicker
              color={theme.primaryColor}
              onChange={onCustomColorChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 gap-y-4">
        <div>
          <Label>Primary color</Label>
          <Input
            value={theme.primaryColor}
            placeholder="Primary color"
            onChange={onPrimaryColorChange}
          />
        </div>

        <div>
          <Label>Text color</Label>
          <Input
            value={theme.textColor}
            placeholder="Text color"
            onChange={onTextColorChange}
          />
        </div>

        <div>
          <Label>Background color</Label>
          <Input
            value={theme.backgroundColor}
            placeholder="Background color"
            onChange={onbgColorChange}
          />
        </div>
      </div>
    </SectionBase>
  );
};

export default Theme;
