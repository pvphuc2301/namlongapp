import { Card } from "antd";

const Project = ({ project }) => {
    console.log(project);

    return (
        <Card
            hoverable
            cover={<img src={`/img/projects/${project.imageCover}`} alt={project.name} />}
            style={{ width: 300 }}
        >
            <Card.Meta title={project.name} description={<p> <i className="bi bi-geo-alt"></i> {project.location}</p>} />
        </Card>
    )
}

export default Project;