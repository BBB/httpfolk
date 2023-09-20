export interface NodeAndParent<
  Node,
  Parent extends NodeAndParent<any, any> | null = null,
> {
  node: Node;
  parent: Parent;
}
