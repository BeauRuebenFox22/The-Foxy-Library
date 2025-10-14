import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'iv-layout',
  styleUrl: 'iv-layout.scss',
  shadow: false,
})

export class IvLayout {

  @Prop() sectionId?: string;
  @Prop() gridTemplateAreas?: string;
  @Prop() gap: string = '2rem';
  @Prop() verticalAlign: string = 'center';
  @Prop() horizontalAlign: string = 'center';
  @Prop() wrapperTag: string = 'div';
  @Prop() classModifier?: string;

  private handleNamedSlots() {
    const slots: Array<string> = [];
    if(this.gridTemplateAreas) {
      const areaNames = this.gridTemplateAreas.replace(/"/g, '') .split(/\s+/).filter(Boolean);
      areaNames.forEach(slot => {
        if(!slots.includes(slot)) slots.push(slot);
      });
    };
    return slots;
  };

  private generateGridStyes() {
    let gridStyles: { [key: string]: string } = {};
    if(this.gridTemplateAreas) {
      gridStyles = {
        display: 'grid',
        gridTemplateAreas: this.gridTemplateAreas,
        gap: this.gap 
      }
    } else {
      gridStyles = {
        display: 'flex',
        gap: this.gap,
        alignItems: this.verticalAlign,
        justifyContent: this.horizontalAlign
      };
    };
    return gridStyles;
  };

  render() {

    const Tag = this.wrapperTag as any;
    
    return (
      <Tag 
        id={this.sectionId ? this.sectionId : undefined} 
        class={`iv-layout${this.classModifier ? ` iv-layout--${this.classModifier}` : ''}`}
        style={this.generateGridStyes()}>
        {this.gridTemplateAreas ? (
          this.handleNamedSlots().map(slot => (
            <div style={{ gridArea: slot }}>
              <slot name={slot} />
            </div> 
          ))
        ) : (
          <slot />
        )}
      </Tag>
    );

  };

};