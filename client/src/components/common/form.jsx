import React from 'react'
import { Label } from '../ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

const CommonForm = ({ formControls, formData, setFormData, onSubmit, buttonText,isButtonDisabled}) => {
  const renderInputByComponentType = (getControlItem) => {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            type={getControlItem.type}
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [getControlItem.name]: e.target.value })
            }
          />
        );
        break;

      case "select":
        element = (
          <Select
            value={value}
            onValueChange={(val) =>
              setFormData({ ...formData, [getControlItem.name]: val })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options?.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [getControlItem.name]: e.target.value })
            }
          />
        );
        break;

      default:
        element = (
          <Input
            type={getControlItem.type}
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [getControlItem.name]: e.target.value })
            }
          />
        );
        break;
    }
    return element;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((ControlItem) => (
          <div className="grid w-full gap-1.5" key={ControlItem.name}>
            <Label className="mb-1">{ControlItem.label}</Label>
            {renderInputByComponentType(ControlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isButtonDisabled} className="mt-3 w-full" type="submit">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
